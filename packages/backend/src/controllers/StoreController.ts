import { Response } from "express";
import { validateRequest } from "../model/network/validation";
import Store, { StoreProjection } from "../model/db/Store";
import Log from "../model/db/Log";
import { paginateOptions, paginateResponse } from "../paginationUtils";
import mongoose from "mongoose";
import { io } from "../app";
import User from "../model/db/User";
import Order from "../model/db/Order";
import { CreateUpdateStoreInputSchema } from "../model/network/json_schema/CreateUpdateStoreInput";
import { GetStoresInputSchema } from "../model/network/json_schema/GetStoresInput";
import { UserRequest } from "../utils";

const checkStoreConsistence = async (store, storeId?) => {
  const invalidAuthorizationError = {
    code: 400,
    error: {
      errCode: "invalidArgument",
      message: "Invalid store authorization",
    },
  };
  const userSet = new Set(
    store.authorizations.map((authorization) => authorization.userId)
  );
  if (userSet.size != store.authorizations.length) {
    throw invalidAuthorizationError;
  }
  const promises = new Array<Promise<unknown>>();
  userSet.forEach((userId) => {
    if (!mongoose.isValidObjectId(userId)) {
      throw invalidAuthorizationError;
    }
    promises.push(
      User.findById(userId).then((user) => {
        if (!user) {
          throw invalidAuthorizationError;
        }
      })
    );
  });
  promises.push(
    Store.findOne({ name: store.name }).then((store) => {
      if (store && !(storeId && store._id == storeId)) {
        throw {
          code: 400,
          error: { errCode: "nameAlreadyInUse", message: "Invalid Store name" },
        };
      }
    })
  );
  await Promise.all(promises);
};

export const getUserStoreRole = async (userId, storeId) => {
  const store = await Store.findById(storeId, {});
  if (!store) {
    throw {
      code: 400,
      error: {
        errCode: "itemNotFound",
        message: "Invalid Input: Store not found",
      },
    };
  }
  const userAuthorization = store.authorizations.find(
    (x) => x.userId.toString() == userId
  );
  if (userAuthorization) {
    return userAuthorization.accessLevel;
  } else {
    return undefined;
  }
};

export const addStore = (req: UserRequest, res: Response) => {
  if (!req.user.isAdmin) {
    res.status(403).json({
      errCode: "notAuthorized",
      message: "User not authorized",
    });
    return;
  }
  if (!validateRequest(CreateUpdateStoreInputSchema, req.body)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input",
    });
    return;
  }
  checkStoreConsistence(req.body)
    .then(() => {
      Store.create(req.body).then((store) => {
        Log.create({
          username: req.user.username,
          action: "Create",
          object: {
            id: store._id,
            type: "Store",
          },
        }).then(() => {
          io.emit("storeChanged", { id: store._id, action: "create" });
          res.json("Add Store");
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
export const getStores = (req: UserRequest, res: Response) => {
  if (!validateRequest(GetStoresInputSchema, req.query)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input",
    });
    return;
  }
  const query = {};
  if (req.query.authorized) {
    query["authorizations.userId"] = req.user.id;
  }
  if (req.query.searchName) {
    query["name"] = { $regex: req.query.searchName, $options: "i" };
  }
  const options = paginateOptions(
    query,
    StoreProjection,
    {},
    req.query.limit,
    req.query.pagingNext,
    req.query.paginatePrevious
  );
  Store.paginate(options, (err) => res.status(500).json(err)).then((result) => {
    res.json(paginateResponse(result));
  });
};

export const getStoreById = (req: UserRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.storeId)) {
    res
      .status(400)
      .json({ errCode: "invalidArgument", message: "Invalid ID supplied" });
    return;
  }
  Store.findById(req.params.storeId, StoreProjection).then(
    (store) => {
      if (store == null) {
        res.status(404).json({ message: "Store not found" });
      } else {
        res.json(store);
      }
    },
    (err) => res.status(500).json(err)
  );
};
export const updateStore = (req: UserRequest, res: Response) => {
  if (!req.user.isAdmin) {
    res
      .status(403)
      .json({ errCode: "notAuthorized", message: "User not authorized" });
  }
  if (
    !validateRequest(CreateUpdateStoreInputSchema, req.body) ||
    !mongoose.isValidObjectId(req.params.storeId)
  ) {
    res
      .status(400)
      .json({ errCode: "invalidArgument", message: "Invalid Input" });
    return;
  }
  checkStoreConsistence(req.body, req.params.storeId)
    .then(() => {
      Store.findByIdAndUpdate(req.params.storeId, req.body, { new: true }).then(
        (store) => {
          if (store == null) {
            throw {
              code: 404,
              error: {
                errCode: "itemNotFound",
                message: "Store not found",
              },
            };
          } else {
            Log.create({
              username: req.user.username,
              action: "Update",
              object: {
                id: store._id,
                type: "Store",
              },
            }).then(() => {
              io.emit("storeChanged", { id: store._id, action: "update" });
              res.json({ message: "Store Updated" });
            });
          }
        }
      );
    })
    .catch((err) => {
      if (err.code && err.error) {
        res.status(err.code).json(err.error);
      } else {
        res.status(500).json(err);
      }
    });
};

export const deleteStore = (req: UserRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.storeId)) {
    res
      .status(400)
      .send({ errCode: "invalidArgument", message: "Invalid ID supplied" });
    return;
  }
  Order.findOne({ "store.id": req.params.storeId })
    .then((order) => {
      if (order) {
        throw {
          code: 403,
          error: {
            errCode: "cannotDelete",
            message: "Can't delete: the store has associated orders",
          },
        };
      }
    })
    .then(() => {
      Store.findByIdAndDelete(req.params.storeId).then((store) => {
        if (store == null) {
          throw {
            code: 404,
            error: {
              errCode: "itemNotFound",
              message: "Store not found",
            },
          };
        } else {
          Log.create({
            username: req.user.username,
            action: "Delete",
            object: {
              id: store._id,
              type: "Store",
            },
          }).then(() => {
            io.emit("storeChanged", { id: store._id, action: "delete" });
            res.json({ message: "Store deleted" });
          });
        }
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
