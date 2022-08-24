import { Response } from "express";
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
import { UserRequest } from "@/utils";
import { CreateUpdateCustomerInput } from "@common/model/network/CreateUpdateCustomerInput";

const checkCustomerConsistence = async (
  input: CreateUpdateCustomerInput,
  customerId?: string
) => {
  const customer = await Customer.findOne({ name: input.name });
  if (customer && !(customerId && customer._id.toString() == customerId)) {
    throw {
      code: 400,
      error: {
        errCode: "nameAlreadyInUse",
        message: "Invalid Customer name",
      },
    };
  }
};

export const addCustomer = (req: UserRequest, res: Response) => {
  if (!validateRequest(CreateUpdateCustomerInputSchema, req.body)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input",
    });
    return;
  }
  checkCustomerConsistence(req.body)
    .then(() => {
      Customer.create(req.body).then((customer) => {
        Log.create({
          username: req.user.username,
          action: "Create",
          object: {
            id: customer._id,
            type: "Customer",
          },
        }).then(() => {
          io.emit("customerChanged", { id: customer._id, action: "create" });
          res.json("Add Customer");
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
export const getCustomers = (req: UserRequest, res: Response) => {
  if (!validateRequest(GetCustomersInputSchema, req.query)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input",
    });
    return;
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
  Customer.paginate(options, (err) => res.status(500).json(err)).then(
    (result) => {
      res.json(paginateResponse(result));
    }
  );
};

export const getCustomerById = (req: UserRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.customerId)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid ID supplied",
    });
    return;
  }
  Customer.findById(req.params.customerId, CustomerProjection).then(
    (customer) => {
      if (customer == null) {
        res.status(404).json({
          errCode: "itemNotFound",
          message: "Product not found",
        });
      } else {
        res.json(customer);
      }
    },
    (err) => res.status(500).json(err)
  );
};

export const updateCustomer = (req: UserRequest, res: Response) => {
  if (
    !validateRequest(CreateUpdateCustomerInputSchema, req.body) ||
    !mongoose.isValidObjectId(req.params.customerId)
  ) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input",
    });
    return;
  }
  checkCustomerConsistence(req.body, req.params.customerId)
    .then(() => {
      Customer.findByIdAndUpdate(req.params.customerId, req.body, {
        new: true,
      }).then((customer) => {
        if (customer == null) {
          throw {
            code: 404,
            error: {
              errCode: "itemNotFound",
              message: "Customer not found",
            },
          };
        } else {
          Log.create({
            username: req.user.username,
            action: "Update",
            object: {
              id: customer._id,
              type: "Customer",
            },
          }).then(() => {
            io.emit("customerChanged", { id: customer._id, action: "update" });
            res.json({ message: "Customer updated" });
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
export const deleteCustomer = (req: UserRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.customerId)) {
    res.status(400).send({
      errCode: "invalidArgument",
      message: "Invalid ID supplied",
    });
    return;
  }
  Order.findOne({ "customer.id": req.params.customerId })
    .then((order) => {
      if (order) {
        throw {
          code: 403,
          error: {
            errCode: "cannotDelete",
            message:
              "Can't delete customer: the customer has associated orders",
          },
        };
      }
    })
    .then(() => {
      Customer.findByIdAndDelete(req.params.customerId).then((customer) => {
        if (customer == null) {
          throw {
            code: 404,
            error: {
              errCode: "itemNotFound",
              message: "Customer not found",
            },
          };
        } else {
          Log.create({
            username: req.user.username,
            action: "Delete",
            object: {
              id: customer._id,
              type: "Customer",
            },
          }).then(() => {
            io.emit("customerChanged", { id: customer._id, action: "delete" });
            res.json({ message: "Customer deleted" });
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
