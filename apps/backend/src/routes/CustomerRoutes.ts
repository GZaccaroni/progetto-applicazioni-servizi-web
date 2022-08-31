import { Router } from "express";
import {
  addCustomer,
  deleteCustomer,
  getCustomerById,
  findCustomers,
  updateCustomer,
} from "@/controllers/CustomerController";

const CustomerRoutes = Router();

CustomerRoutes.route("/").post(addCustomer);

CustomerRoutes.route("/find").get(findCustomers);

CustomerRoutes.route("/:customerId")
  .get(getCustomerById)
  .post(updateCustomer)
  .delete(deleteCustomer);

export default CustomerRoutes;
