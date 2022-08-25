import { validateRequest } from "@common/validation";
import Customer, {
  CustomerDocument,
  CustomerProjection,
} from "@/model/db/Customer";
import Log from "@/model/db/Log";
import { paginateOptions, paginateResponse } from "@/paginationUtils";
import mongoose, { FilterQuery } from "mongoose";
import { io } from "@/app";
import Order from "@/model/db/Order";
import { CreateUpdateCustomerInputSchema } from "@common/validation/json_schema/CreateUpdateCustomerInput";
import { GetCustomersInputSchema } from "@common/validation/json_schema/GetCustomersInput";
import { callableUserFunction } from "@/utils";
import { CreateUpdateCustomerInput } from "@common/model/network/CreateUpdateCustomerInput";
import { BackendError } from "@/model/common/BackendError";

const checkCustomerConsistence = async (
  input: CreateUpdateCustomerInput,
  customerId?: string
) => {
  const customer = await Customer.findOne({ name: input.name });
  if (customer && !(customerId && customer._id.toString() == customerId)) {
    throw new BackendError("nameAlreadyInUse");
  }
};

export const addCustomer = callableUserFunction(async (req) => {
  if (!validateRequest(CreateUpdateCustomerInputSchema, req.body)) {
    throw new BackendError("invalidArgument");
  }
  await checkCustomerConsistence(req.body);
  const newCustomer = await Customer.create(req.body);
  await Log.create({
    username: req.user.username,
    action: "Create",
    object: {
      id: newCustomer._id,
      type: "Customer",
    },
  });
  io.emit("customerChanged", { id: newCustomer._id, action: "create" });
});
export const getCustomers = callableUserFunction(async (req) => {
  if (!validateRequest(GetCustomersInputSchema, req.query)) {
    throw new BackendError("invalidArgument");
  }
  const query: FilterQuery<CustomerDocument> = {};
  if (req.query.searchName) {
    query["name"] = { $regex: req.query.searchName, $options: "i" };
  }
  const options = paginateOptions(
    query,
    CustomerProjection,
    {},
    req.query.limit,
    req.query.pagingNext,
    req.query.paginatePrevious
  );
  const result = await Customer.paginate(options);
  return paginateResponse(result);
});

export const getCustomerById = callableUserFunction(async (req) => {
  if (!mongoose.isValidObjectId(req.params.customerId)) {
    throw new BackendError("invalidArgument", "Invalid id supplied");
  }
  const item = await Customer.findById(
    req.params.customerId,
    CustomerProjection
  );
  if (item == null) {
    throw new BackendError("itemNotFound");
  }
  return item;
});

export const updateCustomer = callableUserFunction(async (req) => {
  if (
    !validateRequest(CreateUpdateCustomerInputSchema, req.body) ||
    !mongoose.isValidObjectId(req.params.customerId)
  ) {
    throw new BackendError("invalidArgument");
  }
  await checkCustomerConsistence(req.body, req.params.customerId);
  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.params.customerId,
    req.body,
    {
      new: true,
    }
  );
  if (updatedCustomer == null) {
    throw new BackendError("itemNotFound");
  }
  await Log.create({
    username: req.user.username,
    action: "Update",
    object: {
      id: updatedCustomer._id,
      type: "Customer",
    },
  });
  io.emit("customerChanged", { id: updatedCustomer._id, action: "update" });
});
export const deleteCustomer = callableUserFunction(async (req) => {
  if (!mongoose.isValidObjectId(req.params.customerId)) {
    throw new BackendError("invalidArgument", "Invalid id supplied");
  }
  const associatedOrder = await Order.findOne({
    "customer.id": req.params.customerId,
  });
  if (associatedOrder) {
    throw new BackendError("nonDeletable");
  }
  const deletedCustomer = await Customer.findByIdAndDelete(
    req.params.customerId
  );
  if (deletedCustomer == null) {
    throw new BackendError("itemNotFound");
  }
  await Log.create({
    username: req.user.username,
    action: "Delete",
    object: {
      id: deletedCustomer._id,
      type: "Customer",
    },
  });
  io.emit("customerChanged", { id: deletedCustomer._id, action: "delete" });
});
