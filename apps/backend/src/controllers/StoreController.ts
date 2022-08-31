import { validateRequest } from "@colture-in-cloud/common/dist/validation";
import Store, { StoreDocument, StoreProjection } from "@/model/db/Store";
import Log from "@/model/db/Log";
import mongoose, { FilterQuery, Types } from "mongoose";
import { io } from "@/app";
import User from "@/model/db/User";
import Order from "@/model/db/Order";
import { CreateUpdateStoreInputSchema } from "@colture-in-cloud/common/dist/validation/json_schema/CreateUpdateStoreInput";
import { FindStoresInputSchema } from "@colture-in-cloud/common/dist/validation/json_schema/FindStoresInput";
import { callableUserFunction } from "@/utils";
import { CreateUpdateStoreInput } from "@colture-in-cloud/common/dist/model/network/CreateUpdateStoreInput";
import { BackendError } from "@/model/common/BackendError";
import { StoreAccessLevel } from "@colture-in-cloud/common/dist/model/common/StoreAccessLevel";

async function checkStoreConsistence(
  input: CreateUpdateStoreInput,
  storeId?: string
): Promise<void> {
  const invalidAuthorizationError = new BackendError(
    "invalidArgument",
    "Invalid store authorization"
  );
  const store = await Store.findOne({ name: input.name }).lean();
  if (store && !(storeId && store._id?.toString() == storeId)) {
    throw new BackendError("nameAlreadyInUse");
  }
  const usersIds = input.authorizations.map(
    (authorization) => authorization.userId
  );
  const usersExistsPromises = usersIds.map(async (userId) => {
    if (!mongoose.isValidObjectId(userId)) {
      throw invalidAuthorizationError;
    }
    const user = await User.findById(userId).lean();
    return user != null;
  });
  const usersExists = (await Promise.all(usersExistsPromises)).every(
    (el) => el
  );
  if (!usersExists) {
    throw invalidAuthorizationError;
  }
}

export async function getUserStoreRole(
  userId: Types.ObjectId,
  storeId: string
): Promise<StoreAccessLevel | undefined> {
  const store = await Store.findById(storeId, {}).lean();
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
    action: "create",
    object: {
      id: store._id,
      type: "store",
    },
  });
  io.emit("storeChanged", { id: store._id, action: "create" });
});
export const findStores = callableUserFunction(async (req) => {
  if (!validateRequest(FindStoresInputSchema, req.query)) {
    throw new BackendError("invalidArgument");
  }
  const query: FilterQuery<StoreDocument> = {};
  if (!req.user.isAdmin) {
    if (req.query.authorized) {
      query["authorizations.userId"] = req.user.id;
    } else {
      throw new BackendError("notAuthorized");
    }
  }
  if (req.query.searchName) {
    query["name"] = { $regex: req.query.searchName, $options: "i" };
  }
  return await Store.paginate({
    query,
    paginatedField: "_id",
    sortAscending: false,
    projection: StoreProjection,
    limit: req.query.limit,
    lean: true,
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
  const item = await Store.findById(req.params.storeId, StoreProjection).lean();
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

  const updatedStore = await Store.updateOne(
    { _id: req.params.storeId },
    req.body
  );
  if (updatedStore.matchedCount < 1) {
    throw new BackendError("itemNotFound");
  }
  await Log.create({
    username: req.user.username,
    action: "update",
    object: {
      id: req.params.storeId,
      type: "store",
    },
  });
  io.emit("storeChanged", { id: req.params.storeId, action: "update" });
});

export const deleteStore = callableUserFunction(async (req) => {
  if (!mongoose.isValidObjectId(req.params.storeId)) {
    throw new BackendError("invalidArgument", "Invalid id supplied");
  }
  const order = await Order.findOne({ "store.id": req.params.storeId }).lean();
  if (order) {
    throw new BackendError(
      "nonDeletable",
      "Can't delete: the store has associated orders"
    );
  }
  const storeId = req.params.storeId;
  const deletedStore = await Store.deleteOne({ _id: storeId });
  if (deletedStore.deletedCount < 1) {
    throw new BackendError("itemNotFound");
  }
  await Log.create({
    username: req.user.username,
    action: "delete",
    object: {
      id: storeId,
      type: "store",
    },
  });
  io.emit("storeChanged", { id: storeId, action: "delete" });
});
