import { validateRequest } from "@common/validation";
import Customer, {
  CustomerDocument,
  CustomerProjection,
} from "@/model/db/Customer";
import Log from "@/model/db/Log";
import mongoose, { FilterQuery, Types } from "mongoose";
import { io } from "@/app";
import Order from "@/model/db/Order";
import { CreateUpdateCustomerInputSchema } from "@common/validation/json_schema/CreateUpdateCustomerInput";
import { FindCustomersInputSchema } from "@common/validation/json_schema/FindCustomersInput";
import { callableUserFunction } from "@/utils";
import { CreateUpdateCustomerInput } from "@common/model/network/CreateUpdateCustomerInput";
import { BackendError } from "@/model/common/BackendError";

const checkCustomerConsistence = async (
  input: CreateUpdateCustomerInput,
  customerId?: string
) => {
  const customer = await Customer.findOne({ name: input.name }).lean();
  if (customer && !(customerId && customer._id.toString() == customerId)) {
    throw new BackendError("nameAlreadyInUse");
  }
};

export const addCustomer = callableUserFunction(async (req) => {
  if (!validateRequest(CreateUpdateCustomerInputSchema, req.body)) {
    throw new BackendError("invalidArgument");
  }
  await checkCustomerConsistence(req.body);
  const newCustomer = await Customer.create(req.body);
  await Log.create({
    username: req.user.username,
    action: "create",
    object: {
      id: newCustomer._id,
      type: "customer",
    },
  });
  io.emit("customerChanged", { id: newCustomer._id, action: "create" });
});
export const getCustomers = callableUserFunction(async (req) => {
  if (!validateRequest(FindCustomersInputSchema, req.query)) {
    throw new BackendError("invalidArgument");
  }
  const query: FilterQuery<CustomerDocument> = {};
  if (req.query.searchName) {
    query["name"] = { $regex: req.query.searchName, $options: "i" };
  }
  return await Customer.paginate({
    query,
    paginatedField: "_id",
    sortAscending: true,
    limit: req.query.limit,
    projection: CustomerProjection,
    lean: true,
    cursors: {
      next: req.query.pagingNext,
      previous: req.query.pagingPrevious,
    },
  });
});

export const getCustomerById = callableUserFunction(async (req) => {
  if (!mongoose.isValidObjectId(req.params.customerId)) {
    throw new BackendError("invalidArgument", "Invalid id supplied");
  }
  const item = await Customer.findById(
    req.params.customerId,
    CustomerProjection
  ).lean();
  if (item == null) {
    throw new BackendError("itemNotFound");
  }
  return item;
});

export const updateCustomer = callableUserFunction(async (req) => {
  if (
    !validateRequest(CreateUpdateCustomerInputSchema, req.body) ||
    !mongoose.isValidObjectId(req.params.customerId)
  ) {
    throw new BackendError("invalidArgument");
  }
  await checkCustomerConsistence(req.body, req.params.customerId);
  const customerId = new Types.ObjectId(req.params.customerId);
  const updatedCustomer = await Customer.updateOne(
    { _id: req.params.customerId },
    req.body
  );
  if (updatedCustomer.matchedCount < 1) {
    throw new BackendError("itemNotFound");
  }
  await Log.create({
    username: req.user.username,
    action: "update",
    object: {
      id: customerId,
      type: "customer",
    },
  });
  io.emit("customerChanged", { id: customerId, action: "update" });
});
export const deleteCustomer = callableUserFunction(async (req) => {
  if (!mongoose.isValidObjectId(req.params.customerId)) {
    throw new BackendError("invalidArgument", "Invalid id supplied");
  }
  const associatedOrder = await Order.findOne({
    "customer.id": req.params.customerId,
  }).lean();
  if (associatedOrder) {
    throw new BackendError("nonDeletable");
  }
  const customerId = new Types.ObjectId(req.params.customerId);
  const deletedCustomer = await Customer.deleteOne({
    _id: customerId,
  });
  if (deletedCustomer.deletedCount < 1) {
    throw new BackendError("itemNotFound");
  }
  await Log.create({
    username: req.user.username,
    action: "delete",
    object: {
      id: customerId,
      type: "customer",
    },
  });
  io.emit("customerChanged", { id: customerId, action: "delete" });
});
