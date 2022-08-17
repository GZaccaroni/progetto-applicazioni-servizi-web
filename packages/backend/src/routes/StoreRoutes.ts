import { Router } from "express";
import {
  addStore,
  deleteStore,
  getStoreById,
  getStores,
  updateStore,
} from "../controllers/StoreController";

const StoreRoutes = Router();

StoreRoutes.route("/").post(addStore);

StoreRoutes.route("/find").get(getStores);

StoreRoutes.route("/:storeId")
  .get(getStoreById)
  .post(updateStore)
  .delete(deleteStore);

export default StoreRoutes;
