import { Router } from "express";
import {
  addOrder,
  deleteOrder,
  getOrderById,
  findOrders,
  updateOrder,
} from "@/controllers/OrderController";

const OrderRoutes = Router();

OrderRoutes.route("/").post(addOrder);

OrderRoutes.route("/find").get(findOrders);

OrderRoutes.route("/:orderId")
  .get(getOrderById)
  .post(updateOrder)
  .delete(deleteOrder);

export default OrderRoutes;
