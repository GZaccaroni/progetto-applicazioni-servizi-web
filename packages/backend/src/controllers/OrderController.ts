import { validateRequest } from "@common/validation";
import Order, {
  OrderDocument,
  OrderDocumentEntry,
  OrderProjection,
} from "@/model/db/Order";
import Log from "@/model/db/Log";
import Store from "@/model/db/Store";
import Product from "@/model/db/Product";
import Customer, { CustomerProjection } from "@/model/db/Customer";
import mongoose, { FilterQuery } from "mongoose";
import { io } from "@/app";
import { getUserStoreRole } from "./StoreController";
import { CreateUpdateOrderInputSchema } from "@common/validation/json_schema/CreateUpdateOrderInput";
import { FindOrdersInputSchema } from "@common/validation/json_schema/FindOrdersInput";
import { callableUserFunction, DbIdentifiable } from "@/utils";
import { StoreAccessLevel } from "@/model/common/StoreAccessLevel";
import { CreateUpdateOrderInput } from "@common/model/network/CreateUpdateOrderInput";
import { BackendError } from "@/model/common/BackendError";

const enrichOrder = async (
  order: CreateUpdateOrderInput,
  creatorId: string
): Promise<Omit<OrderDocument, keyof DbIdentifiable>> => {
  //get Store data
  const store: OrderDocument["store"] | null = await Store.findById(
    order.storeId,
    {
      id: "$_id",
      name: 1,
    }
  ).lean();
  if (store == null) {
    throw new BackendError("invalidArgument", "Store not found");
  }

  //get Customer data
  const customer: OrderDocument["customer"] | null = await Customer.findById(
    order.customerId,
    CustomerProjection
  ).lean();
  if (customer == null) {
    throw new BackendError("invalidArgument", "Customer not found");
  }

  //generate product name
  const entryPromises = order.entries.map(async (entry) => {
    const product = await Product.findById(entry.productId).lean();
    if (product == null) {
      throw new BackendError("invalidArgument", "Product not found");
    }
    let entryName: string;
    if (entry.variantId) {
      const kind = product.kinds.find((x) => x.id == entry.variantId);
      if (kind == null) {
        throw new BackendError("invalidArgument", "Product kind not found");
      }
      entryName = kind.fullName;
    } else {
      entryName = product.name;
    }
    const enrichedEntry: OrderDocumentEntry = Object.assign(
      {
        name: entryName,
        price: entry.pricePerUnit * entry.quantity,
      },
      entry
    );
    return enrichedEntry;
  });
  const entries = await Promise.all(entryPromises);

  //compute tot
  const price = entries.reduce((sum, entry) => sum + entry.price, 0);

  return {
    date: new Date(order.date),
    store: store,
    customer: customer,
    entries: entries,
    createdBy: creatorId,
    price: price,
    note: order.note,
  };
};

export const addOrder = callableUserFunction(async (req) => {
  if (!validateRequest(CreateUpdateOrderInputSchema, req.body)) {
    throw new BackendError("invalidArgument");
  }
  const storeRole = await getUserStoreRole(req.user._id, req.body.storeId);
  if (storeRole == undefined && !req.user.isAdmin) {
    throw new BackendError("notAuthorized");
  }
  const enrichedOrder = await enrichOrder(req.body, req.user._id.toString());
  const newOrder = await Order.create(enrichedOrder);
  await Log.create({
    username: req.user.username,
    action: "create",
    object: {
      id: newOrder._id,
      type: "order",
    },
  });
  io.emit("orderChanged", { id: newOrder._id, action: "create" });
});
export const findOrders = callableUserFunction(async (req) => {
  const requestQuery = req.query;
  if (!validateRequest(FindOrdersInputSchema, requestQuery)) {
    throw new BackendError("invalidArgument");
  }
  if (requestQuery.storeId != undefined) {
    if (!mongoose.isValidObjectId(requestQuery.storeId)) {
      throw new BackendError("invalidArgument");
    }
    const storeRole = await getUserStoreRole(
      req.user._id,
      requestQuery.storeId
    );
    if (storeRole == undefined && !req.user.isAdmin) {
      throw new BackendError("notAuthorized");
    }
  }
  const query: FilterQuery<OrderDocument> = {};
  if (requestQuery.storeId != undefined) {
    query["store.id"] = requestQuery.storeId;
  } else {
    if (!req.user.isAdmin) {
      // Show only authorized store data
      const stores = await Store.find(
        { "authorizations.userId": req.user._id },
        "_id"
      ).lean();
      query["store.id"] = {
        $in: stores.map((elem) => elem._id),
      };
    }
  }
  if (requestQuery.fromDate != undefined) {
    if (!query["date"]) {
      query["date"] = {};
    }
    query["date"]["$gte"] = new Date(requestQuery.fromDate);
  }
  if (requestQuery.toDate != undefined) {
    if (!query["date"]) {
      query["date"] = {};
    }
    query["date"]["$lte"] = new Date(requestQuery.toDate);
  }
  return await Order.paginate({
    query,
    paginatedField: "date",
    sortAscending: false,
    projection: OrderProjection,
    limit: requestQuery.limit,
    lean: true,
    cursors: {
      next: requestQuery.pagingNext,
      previous: requestQuery.pagingPrevious,
    },
  });
});
export const getOrderById = callableUserFunction(async (req) => {
  if (!mongoose.isValidObjectId(req.params.orderId)) {
    throw new BackendError("invalidArgument", "Invalid id supplied");
  }
  const item = await Order.findById(req.params.orderId, OrderProjection).lean();
  if (item == null) {
    throw new BackendError("itemNotFound");
  }
  const userStoreRole = await getUserStoreRole(req.user._id, item.store.id);
  if (userStoreRole == null && !req.user.isAdmin) {
    throw new BackendError("notAuthorized");
  }
  return item;
});
export const updateOrder = callableUserFunction(async (req) => {
  if (
    !validateRequest(CreateUpdateOrderInputSchema, req.body) ||
    !mongoose.isValidObjectId(req.params.orderId)
  ) {
    throw new BackendError("invalidArgument");
  }
  const order = await Order.findById(req.params.orderId).lean();
  if (order == null) {
    throw new BackendError("itemNotFound");
  }
  const storeRole = await getUserStoreRole(req.user._id, order.store.id);
  if (
    !(
      storeRole == StoreAccessLevel.Salesman &&
      order.createdBy == req.user._id.toString()
    ) &&
    storeRole != StoreAccessLevel.Manager &&
    !req.user.isAdmin
  ) {
    throw new BackendError("notAuthorized");
  }
  const enrichedOrder = await enrichOrder(req.body, order.createdBy);
  const updatedOrder = await Order.updateOne({ _id: order._id }, enrichedOrder);
  if (updatedOrder.matchedCount < 1) {
    throw new BackendError("itemNotFound");
  }
  await Log.create({
    username: req.user.username,
    action: "update",
    object: {
      id: order._id,
      type: "order",
    },
  });
  io.emit("orderChanged", {
    id: order._id,
    action: "update",
  });
});
export const deleteOrder = callableUserFunction(async (req) => {
  if (!mongoose.isValidObjectId(req.params.orderId)) {
    throw new BackendError("invalidArgument", "Invalid id supplied");
  }
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId).lean();
  if (order == null) {
    throw {
      code: 404,
      error: {
        errCode: "itemNotFound",
        message: "Order not found",
      },
    };
  }
  const storeRole = await getUserStoreRole(req.user._id, order.store.id);
  if (
    !(
      storeRole == StoreAccessLevel.Salesman &&
      order.createdBy == req.user._id.toString()
    ) &&
    storeRole != StoreAccessLevel.Manager &&
    !req.user.isAdmin
  ) {
    throw new BackendError("notAuthorized");
  }
  const deletedOrder = await Order.deleteOne({ _id: orderId });
  if (deletedOrder.deletedCount < 1) {
    throw new BackendError("itemNotFound");
  }
  await Log.create({
    username: req.user.username,
    action: "delete",
    object: {
      id: order._id,
      type: "order",
    },
  });
  io.emit("orderChanged", { id: order._id, action: "delete" });
});
