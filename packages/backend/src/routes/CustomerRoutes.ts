import { Router } from "express";
import {
  addCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from "@/controllers/CustomerController";

const CustomerRoutes = Router();

CustomerRoutes.route("/").post(addCustomer);

CustomerRoutes.route("/find").get(getCustomers);

CustomerRoutes.route("/:customerId")
  .get(getCustomerById)
  .post(updateCustomer)
  .delete(deleteCustomer);

export default CustomerRoutes;
