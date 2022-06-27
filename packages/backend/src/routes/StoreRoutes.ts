import {Router} from "express";
import {addStore, getStoreById, getStores, updateStore} from "../controllers/StoreController";

const StoreRoutes = Router();

StoreRoutes.route("/").post(addStore);

StoreRoutes.route("/find").get(getStores);

StoreRoutes.route("/:id").get(getStoreById)
  .post(updateStore);

export default StoreRoutes;