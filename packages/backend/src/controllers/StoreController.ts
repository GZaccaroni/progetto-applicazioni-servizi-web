import { validateRequest } from "@common/validation";
import Store, { StoreDocument, StoreProjection } from "@/model/db/Store";
import Log from "@/model/db/Log";
import mongoose, { FilterQuery, ObjectId } from "mongoose";
import { io } from "@/app";
import User from "@/model/db/User";
import Order from "@/model/db/Order";
import { CreateUpdateStoreInputSchema } from "@common/validation/json_schema/CreateUpdateStoreInput";
import { GetStoresInputSchema } from "@common/validation/json_schema/GetStoresInput";
import { callableUserFunction } from "@/utils";
import { CreateUpdateStoreInput } from "@common/model/network/CreateUpdateStoreInput";
import { BackendError } from "@/model/common/BackendError";
import { StoreAccessLevel } from "@common/model/common/StoreAccessLevel";

async function checkStoreConsistence(
  input: CreateUpdateStoreInput,
  storeId?: string
): Promise<void> {
  const invalidAuthorizationError = new BackendError(
    "invalidArgument",
    "Invalid store authorization"
  );
  const usersIds = [
    ...new Set(
      input.authorizations.map((authorization) => authorization.userId)
    ),
  ];
  if (usersIds.length != input.authorizations.length) {
    throw invalidAuthorizationError;
  }
  const store = await Store.findOne({ name: input.name });
  if (store && !(storeId && store._id?.toString() == storeId)) {
    throw new BackendError("nameAlreadyInUse");
  }
  const usersExistsPromises = usersIds.map(async (userId) => {
    if (!mongoose.isValidObjectId(userId)) {
      throw invalidAuthorizationError;
    }
    const user = await User.findById(userId);
    return user == null;
  });
  const usersExists = (await Promise.all(usersExistsPromises)).every(
    (el) => el
  );
  if (!usersExists) {
    throw invalidAuthorizationError;
  }
}

export async function getUserStoreRole(
  userId: ObjectId,
  storeId: string
): Promise<StoreAccessLevel | undefined> {
  const store = await Store.findById(storeId, {});
  if (!store) {
    throw new BackendError("invalidArgument", "Store not found");
  }
  const userAuthorization = store.authorizations.find(
    (x) => x.userId == userId.toString()
  );
  if (userAuthorization) {
    return userAuthorization.accessLevel;
  } else {
    return undefined;
  }
}

export const addStore = callableUserFunction(async (req) => {
  if (!req.user.isAdmin) {
    throw new BackendError("notAuthorized");
  }
  if (!validateRequest(CreateUpdateStoreInputSchema, req.body)) {
    throw new BackendError("invalidArgument");
  }
  await checkStoreConsistence(req.body);
  const store = await Store.create(req.body);
  await Log.create({
    username: req.user.username,
    action: "Create",
    object: {
      id: store._id,
      type: "Store",
    },
  });
  io.emit("storeChanged", { id: store._id, action: "create" });
});
export const getStores = callableUserFunction(async (req) => {
  if (!validateRequest(GetStoresInputSchema, req.query)) {
    throw new BackendError("invalidArgument");
  }
  const query: FilterQuery<StoreDocument> = {};
  if (req.query.authorized) {
    query["authorizations.userId"] = req.user.id;
  }
  if (req.query.searchName) {
    query["name"] = { $regex: req.query.searchName, $options: "i" };
  }
  return await Store.paginate({
    query,
    paginatedField: "_id",
    sortAscending: true,
    limit: req.query.limit,
    cursors: {
      next: req.query.pagingNext,
      previous: req.query.pagingPrevious,
    },
  });
});

export const getStoreById = callableUserFunction(async (req) => {
  if (!mongoose.isValidObjectId(req.params.storeId)) {
    throw new BackendError("invalidArgument", "Invalid id supplied");
  }
  const item = await Store.findById(req.params.storeId, StoreProjection);
  if (item == null) {
    throw new BackendError("itemNotFound");
  }
  return item;
});
export const updateStore = callableUserFunction(async (req) => {
  if (!req.user.isAdmin) {
    throw new BackendError("notAuthorized");
  }
  if (
    !validateRequest(CreateUpdateStoreInputSchema, req.body) ||
    !mongoose.isValidObjectId(req.params.storeId)
  ) {
    throw new BackendError("invalidArgument");
  }
  await checkStoreConsistence(req.body, req.params.storeId);

  const updatedStore = await Store.findByIdAndUpdate(
    req.params.storeId,
    req.body,
    {
      new: true,
    }
  );
  if (updatedStore == null) {
    throw new BackendError("itemNotFound");
  }
  await Log.create({
    username: req.user.username,
    action: "Update",
    object: {
      id: updatedStore._id,
      type: "Store",
    },
  });
  io.emit("storeChanged", { id: req.params.storeId, action: "update" });
});

export const deleteStore = callableUserFunction(async (req) => {
  if (!mongoose.isValidObjectId(req.params.storeId)) {
    throw new BackendError("invalidArgument", "Invalid id supplied");
  }
  const order = await Order.findOne({ "store.id": req.params.storeId });
  if (order) {
    throw new BackendError(
      "nonDeletable",
      "Can't delete: the store has associated orders"
    );
  }
  const deletedStore = await Store.findByIdAndDelete(req.params.storeId);
  if (deletedStore == null) {
    throw new BackendError("itemNotFound");
  }
  await Log.create({
    username: req.user.username,
    action: "Delete",
    object: {
      id: deletedStore._id,
      type: "Store",
    },
  });
  io.emit("storeChanged", { id: deletedStore._id, action: "delete" });
});
