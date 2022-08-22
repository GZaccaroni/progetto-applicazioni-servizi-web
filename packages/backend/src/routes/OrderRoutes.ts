import { Router } from "express";
import {
  addOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "@/controllers/OrderController";

const OrderRoutes = Router();

OrderRoutes.route("/").post(addOrder);

OrderRoutes.route("/find").get(getOrders);

OrderRoutes.route("/:orderId")
  .get(getOrderById)
  .post(updateOrder)
  .delete(deleteOrder);

export default OrderRoutes;
