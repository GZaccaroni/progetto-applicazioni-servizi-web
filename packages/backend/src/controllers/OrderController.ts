import { Response } from "express";
import { validateRequest } from "@common/validation";
import Order, {
  OrderDocument,
  OrderDocumentEntry,
  OrderProjection,
} from "@/model/db/Order";
import Log from "@/model/db/Log";
import { paginateOptions, paginateResponse } from "@/paginationUtils";
import Store from "@/model/db/Store";
import Product from "@/model/db/Product";
import Customer, { CustomerProjection } from "@/model/db/Customer";
import mongoose, { FilterQuery } from "mongoose";
import { io } from "@/app";
import { getUserStoreRole } from "./StoreController";
import { CreateUpdateOrderInputSchema } from "@common/validation/json_schema/CreateUpdateOrderInput";
import { GetOrdersInputSchema } from "@common/validation/json_schema/GetOrdersInput";
import { UserRequest } from "@/utils";
import { StoreAccessLevel } from "@/model/common/StoreAccessLevel";
import { CreateUpdateOrderInput } from "@common/model/network/CreateUpdateOrderInput";

const enrichOrder = async (
  order: CreateUpdateOrderInput,
  creatorId: string
): Promise<OrderDocument> => {
  //get Store data
  const store: OrderDocument["store"] | null = await Store.findById(
    order.storeId,
    {
      id: "$_id",
      name: 1,
    }
  );
  if (store == null) {
    throw {
      code: 400,
      error: {
        errCode: "itemNotFound",
        message: "Invalid Input: Store not found",
      },
    };
  }

  //get Customer data
  const customer: OrderDocument["customer"] | null = await Customer.findById(
    order.customerId,
    CustomerProjection
  );
  if (customer == null) {
    throw {
      code: 400,
      error: {
        errCode: "itemNotFound",
        message: "Invalid Input: Customer not found",
      },
    };
  }

  //generate product name
  const entryPromises = order.entries.map(async (entry) => {
    const product = await Product.findById(entry.productId);
    if (product == null) {
      throw {
        code: 400,
        error: {
          errCode: "itemNotFound",
          message: "Invalid Input: Product not found",
        },
      };
    }
    let entryName: string;
    if (entry.variantId) {
      const kind = product.kinds.find((x) => x.id == entry.variantId);
      if (kind) {
        entryName = kind.fullName;
      } else {
        throw {
          code: 400,
          error: {
            errCode: "itemNotFound",
            message: "Invalid Input: Product kind not found",
          },
        };
      }
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

export const addOrder = (req: UserRequest, res: Response) => {
  if (!validateRequest(CreateUpdateOrderInputSchema, req.body)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input",
    });
    return;
  }
  getUserStoreRole(req.user._id, req.body.storeId)
    .then((storeRole) => {
      if (storeRole == undefined && !req.user.isAdmin) {
        throw {
          code: 403,
          error: {
            errCode: "notAuthorized",
            message: "User not authorized",
          },
        };
      }
      enrichOrder(req.body, req.user._id.toString()).then((newOrder) => {
        Order.create(newOrder).then((order) => {
          Log.create({
            username: req.user.username,
            action: "Create",
            object: {
              id: order._id,
              type: "Order",
            },
          }).then(() => {
            io.emit("orderChanged", { id: order._id, action: "create" });
            res.json("Add Order");
          });
        });
      });
    })
    .catch((err) => {
      if (err.code && err.error) {
        res.status(err.code).json(err.error);
      } else {
        res.status(500).json(err);
      }
    });
};
export const getOrders = async (req: UserRequest, res: Response) => {
  const requestQuery = req.query;
  if (!validateRequest(GetOrdersInputSchema, requestQuery)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input",
    });
    return;
  }
  try {
    if (requestQuery.storeId != undefined) {
      if (!mongoose.isValidObjectId(requestQuery.storeId)) {
        res.status(400).json({
          errCode: "invalidArgument",
          message: "Bad request",
        });
        return;
      }
      await getUserStoreRole(req.user._id, requestQuery.storeId).then(
        (storeRole) => {
          if (storeRole == undefined && !req.user.isAdmin) {
            throw {
              code: 403,
              error: {
                errCode: "notAuthorized",
                message: "User not authorized",
              },
            };
          }
        }
      );
    }
    const query: FilterQuery<OrderDocument> = {};
    if (requestQuery.storeId != undefined) {
      query["store.id"] = requestQuery.storeId;
    } else {
      await Store.find({ "authorizations.userId": req.user._id }, "_id").then(
        (storeIds) => {
          query["store.id"] = {
            $in: storeIds.map((elem) => elem._id),
          };
        }
      );
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
    const options = paginateOptions(
      query,
      OrderProjection,
      { date: -1 },
      req.query.limit,
      req.query.pagingNext,
      req.query.paginatePrevious
    );
    Order.paginate(options, (err) => {
      throw err;
    }).then((result) => {
      res.json(paginateResponse(result));
    });
  } catch (err) {
    if (err.code && err.error) {
      res.status(err.code).json(err.error);
    } else {
      res.status(500).json(err);
    }
  }
};
export const getOrderById = (req: UserRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.orderId)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid ID supplied",
    });
    return;
  }
  Order.findById(req.params.orderId, OrderProjection)
    .then((order) => {
      if (order == null) {
        throw {
          code: 404,
          error: {
            errCode: "itemNotFound",
            message: "Order not found",
          },
        };
      } else {
        getUserStoreRole(req.user._id, order.store.id).then((storeRole) => {
          if (storeRole == undefined && !req.user.isAdmin) {
            throw {
              code: 403,
              error: {
                errCode: "notAuthorized",
                message: "User not authorized",
              },
            };
          }
          res.json(order);
        });
      }
    })
    .catch((err) => {
      if (err.code && err.error) {
        res.status(err.code).json(err.error);
      } else {
        res.status(500).json(err);
      }
    });
};
export const updateOrder = (req: UserRequest, res: Response) => {
  if (
    !validateRequest(CreateUpdateOrderInputSchema, req.body) ||
    !mongoose.isValidObjectId(req.params.orderId)
  ) {
    res
      .status(400)
      .json({ errCode: "invalidArgument", message: "Invalid Input" });
    return;
  }
  Order.findById(req.params.orderId, OrderProjection)
    .then((order) => {
      if (order == null) {
        throw {
          code: 404,
          error: {
            errCode: "itemNotFound",
            message: "Order not found",
          },
        };
      } else {
        getUserStoreRole(req.user._id, order.store.id).then((storeRole) => {
          if (
            !(
              storeRole == StoreAccessLevel.Salesman &&
              order.createdBy == req.user._id.toString()
            ) &&
            storeRole != StoreAccessLevel.Manager &&
            !req.user.isAdmin
          ) {
            throw {
              code: 403,
              error: {
                errCode: "notAuthorized",
                message: "User not authorized",
              },
            };
          }
          enrichOrder(req.body, order.createdBy).then((newOrder) => {
            Order.findOneAndReplace({ _id: req.params.orderId }, newOrder).then(
              (order) => {
                if (order == null) {
                  throw {
                    code: 404,
                    error: {
                      errCode: "itemNotFound",
                      message: "Order not found",
                    },
                  };
                } else {
                  Log.create({
                    username: req.user.username,
                    action: "Update",
                    object: {
                      id: order._id,
                      type: "Order",
                    },
                  }).then(() => {
                    io.emit("orderChanged", {
                      id: order._id,
                      action: "update",
                    });
                    res.json("Order Updated");
                  });
                }
              }
            );
          });
        });
      }
    })
    .catch((err) => {
      if (err.code && err.error) {
        res.status(err.code).json(err.error);
      } else {
        res.status(500).json(err);
      }
    });
};
export const deleteOrder = (req: UserRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.orderId)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid ID supplied",
    });
    return;
  }
  Order.findById(req.params.orderId, OrderProjection)
    .then((order) => {
      if (order == null) {
        throw {
          code: 404,
          error: {
            errCode: "itemNotFound",
            message: "Order not found",
          },
        };
      } else {
        getUserStoreRole(req.user._id, order.store.id).then((storeRole) => {
          if (
            !(
              storeRole == StoreAccessLevel.Salesman &&
              order.createdBy == req.user._id.toString()
            ) &&
            storeRole != StoreAccessLevel.Manager &&
            !req.user.isAdmin
          ) {
            throw {
              code: 403,
              error: {
                errCode: "notAuthorized",
                message: "User not authorized",
              },
            };
          }
          Order.findByIdAndDelete(req.params.orderId).then((_) => {
            Log.create({
              username: req.user.username,
              action: "Delete",
              object: {
                id: order._id,
                type: "Order",
              },
            }).then(() => {
              io.emit("orderChanged", { id: order._id, action: "delete" });
              res.json({ message: "Order deleted" });
            });
          });
        });
      }
    })
    .catch((err) => {
      if (err.code && err.error) {
        res.status(err.code).json(err.error);
      } else {
        res.status(500).json(err);
      }
    });
};
