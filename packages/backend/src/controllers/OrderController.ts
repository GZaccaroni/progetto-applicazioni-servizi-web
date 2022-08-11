import {Request, Response} from "express";
import {validateRequest} from "../model/request/validation";
import {CreateOrder} from "../model/request/type/CreateOrder";
import {UpdateOrder} from "../model/request/type/UpdateOrder";
import Order, {OrderProjection} from "../model/db_model/Order";
import Log from "../model/db_model/Log";
import {paginateOptions, paginateResponse} from "../paginationUtils";
import Store from "../model/db_model/Store";
import Product from "../model/db_model/Product";
import Customer, {CustomerProjection} from "../model/db_model/Customer";
import mongoose from "mongoose";
import {io} from "../app";
import {GetOrders} from "../model/request/type/GetOrders";
import {AccessLevel} from "../model/request/type/StoreAuthorization";
import {getUserStoreRole} from "./StoreController";

const enrichOrder = async (order, creatorId) => {
  const enrichedOrder = {
    date: order.date,
    entries: [],
    createdBy: creatorId
  }
  if (order.note) {
    enrichedOrder["note"] = order.note;
  }
  const promises = []
  //get Store data
  promises.push(Store.findById(order.storeId, {id: "$_id", name: 1}).then(
    store => {
      if (store != null) {
        enrichedOrder["store"] = store;
      } else {
        throw {
          code: 400,
          error: {
            errCode: "itemNotFound",
            message: "Invalid Input: Store not found"
          }
        };
      }
    }
  ))
  //generate product name
  const entryPromises = [];
  order.entries.forEach(entry => {
    entry["price"] = entry.pricePerUnit * entry.quantity;
    entryPromises.push(Product.findById(entry.productId).then(product => {
      if (product == null) {
        throw {
          code: 400,
          error: {
            errCode: "itemNotFound",
            message: "Invalid Input: Product not found"
          }
        };
      }
      if (entry.variantId) {
        const kind = product.kinds.find(x => x.id == entry.variantId);
        if (kind) {
          entry["name"] = kind.fullName;
        } else {
          throw {
            code: 400,
            error: {
              errCode: "itemNotFound",
              message: "Invalid Input: Product kind not found"
            }
          };
        }
      } else {
        entry["name"] = product.name;
      }
    }).then(() => enrichedOrder["entries"].push(entry)));
  })
  //compute tot
  promises.push(Promise.all(entryPromises).then(() => enrichedOrder["price"] = enrichedOrder.entries.reduce((sum, entry) => sum + entry.price, 0)));
  //get Customer data
  if (order.customerId) {
    promises.push(Customer.findById(order.customerId, CustomerProjection).then(customer => {
      if (customer != null) {
        enrichedOrder["customer"] = customer;
      } else {
        throw {
          code: 400,
          error: {
            errCode: "itemNotFound",
            message: "Invalid Input: Customer not found"
          }
        };
      }
    }));
  }
  await Promise.all(promises);
  return enrichedOrder;
}

export const addOrder = (req, res: Response) => {
  if (!validateRequest<CreateOrder>("CreateOrder", req.body)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input"
    });
    return;
  }
  getUserStoreRole(req.user._id, req.body.storeId).then(userRole=>{
    if ((userRole != AccessLevel.Salesman || userRole!= AccessLevel.Manager) && !req.user.isAdmin) {
      throw {
        code: 403,
        error: {
          errCode: "notAuthorized",
          message: "User not authorized"
        }
      }
    }
    enrichOrder(req.body,req.user._id).then(newOrder => {
      Order.create(newOrder).then(order => {
        Log.create({
          username: req.user.username,
          action: "Create",
          object: {
            id: order._id,
            type: "Order"
          }
        }).then(() => {
          io.emit("orderChanged", {id: order._id, action: "create"});
          res.json("Add Order");
        });
      })
    })
  }).catch(err => {
    if(err.code && err.error){
      res.status(err.code).json(err.error)
    } else {
      res.status(500).json(err);
    }
  });
}
export const getOrders = (req, res: Response) => {
  if(!validateRequest<GetOrders>("GetOrders",req.query)){
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input"
    });
    return;
  }
  if(!mongoose.isValidObjectId(req.query.storeId)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Bad request"
    });
  }
  getUserStoreRole(req.user._id, req.body.storeId).then(userRole => {
    if ((userRole != AccessLevel.Salesman || userRole != AccessLevel.Manager) && !req.user.isAdmin) {
      throw {
        code: 403,
        error: {
          errCode: "notAuthorized",
          message: "User not authorized"
        }
      }
    }
    const query = {"store.id": req.query.storeId};
    if (req.query.fromDate) {
      if (!query["date"]) {
        query["date"] = {};
      }
      query["date"]["$gte"] = new Date(req.query.fromDate);
    }
    if (req.query.toDate) {
      if (!query["date"]) {
        query["date"] = {};
      }
      query["date"]["$lte"] = new Date(req.query.toDate);
    }
    const options = paginateOptions(query, OrderProjection, {date: -1}, req.query.limit, req.query.pagingNext, req.query.paginatePrevious);
    Order.paginate(options).then((result) => {
      res.json(paginateResponse(result));
    });
  }).catch(err => {
    if (err.code && err.error) {
      res.status(err.code).json(err.error)
    } else {
      res.status(500).json(err);
    }
  });
}
export const getOrderById = (req, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.orderId)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid ID supplied"
    });
    return;
  }
  Order.findById(req.params.orderId,OrderProjection).then(order=>{
      if (order == null) {
        throw {
          code: 404,
          error: {
            errCode: "itemNotFound",
            message: "Order not found"
          }
        }
      } else {
        getUserStoreRole(req.user._id, order.storeId).then(userRole => {
          if ((userRole != AccessLevel.Salesman || userRole != AccessLevel.Manager) && !req.user.isAdmin) {
            throw {
              code: 403,
              error: {
                errCode: "notAuthorized",
                message: "User not authorized"
              }
            }
          }
          res.json(order);
        })
      }
  }).catch(err => {
    if (err.code && err.error) {
      res.status(err.code).json(err.error)
    } else {
      res.status(500).json(err);
    }
  });
}
export const updateOrder = (req, res: Response) => {
  if (!validateRequest<UpdateOrder>("UpdateOrder", req.body)
    || !mongoose.isValidObjectId(req.params.orderId)) {
    res.status(400).json({errCode: "invalidArgument", message: "Invalid Input"});
    return;
  }
  Order.findById(req.params.orderId, OrderProjection).then(order => {
    if (order == null) {
      throw {
        code: 404,
        error: {
          errCode: "itemNotFound",
          message: "Order not found"
        }
      }
    } else {
      getUserStoreRole(req.user._id, order.storeId).then(userRole => {
        if (!(userRole == AccessLevel.Salesman && order.createdBy == req.user._id) && userRole != AccessLevel.Manager && !req.user.isAdmin) {
          throw {
            code: 403,
            error: {
              errCode: "notAuthorized",
              message: "User not authorized"
            }
          }
        }
        enrichOrder(req.body, order.createdBy).then(newOrder => {
          Order.findOneAndReplace({_id: req.params.orderId}, newOrder).then(order => {
            Log.create({
              username: req.user.username,
              action: "Update",
              object: {
                id: order._id,
                type: "Order"
              }
            }).then(() => {
              io.emit("orderChanged", {id: order._id, action: "update"});
              res.json("Order Updated");
            });
          })
        })
      })
    }
  }).catch(err => {
    if (err.code && err.error) {
      res.status(err.code).json(err.error);
    } else {
      res.status(500).json(err);
    }
  });
}
export const deleteOrder=(req,res: Response)=>{
  if (!mongoose.isValidObjectId(req.params.orderId)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid ID supplied"});
    return;
  }
  Order.findById(req.params.orderId, OrderProjection).then(order => {
    if (order == null) {
      throw {
        code: 404,
        error: {
          errCode: "itemNotFound",
          message: "Order not found"
        }
      }
    } else {
      getUserStoreRole(req.user._id, order.storeId).then(userRole => {
        if (!(userRole == AccessLevel.Salesman && order.createdBy == req.user._id) && userRole != AccessLevel.Manager && !req.user.isAdmin) {
          throw {
            code: 403,
            error: {
              errCode: "notAuthorized",
              message: "User not authorized"
            }
          }
        }
        Order.findByIdAndDelete(req.params.orderId).then(order => {
          Log.create({
            username: req.user.username,
            action: "Delete",
            object: {
              id: order._id,
              type: "Order"
            }
          }).then(() => {
            io.emit("orderChanged", {id: order._id, action: "delete"});
            res.json({message: "Order deleted"})
          });
        })
      })
    }
  }).catch(err => {
    if (err.code && err.error) {
      res.status(err.code).json(err.error);
    } else {
      res.status(500).json(err);
    }
  });
}