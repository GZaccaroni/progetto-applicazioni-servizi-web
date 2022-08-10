import {Request, Response} from "express";
import {validateRequest} from "../model/request/validation";
import {CreateCustomer} from "../model/request/type/CreateCustomer";
import {UpdateCustomer} from "../model/request/type/UpdateCustomer";
import Customer, {CustomerProjection} from "../model/db_model/Customer";
import Log from "../model/db_model/Log";
import {paginateOptions, paginateResponse} from "../paginationUtils";
import mongoose from "mongoose";
import {io} from "../app";
import {GetCustomers} from "../model/request/type/GetCustomers";
import Order from "../model/db_model/Order";

const checkCustomerConsistence = async (customer, customerId?) => {
  await Customer.findOne({name: customer.name}).then(customer => {
    if (customer && !(customerId && customer._id == customerId)) {
      throw {
        code: 400,
        error: {errCode: "nameAlreadyinUse", message: "Invalid Customer name"}
      }
    }
  });
}

export const addCustomer = (req, res: Response) => {
  if (!validateRequest<CreateCustomer>("CreateCustomer", req.body)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input"
    });
    return;
  }
  checkCustomerConsistence(req.body).then(()=>{
    Customer.create(req.body).then(
      customer => {
        Log.create({
          username: req.user.username,
          action: "Create",
          object: {
            id: customer._id,
            type: "Customer"
          }
        }).then(() => {
          io.emit("customerChanged", {id: customer._id, action: "create"});
          res.json("Add Customer")
        });
      });
  }).catch(err => {
    if(err.code && err.error){
      res.status(err.code).json(err.error)
    } else {
      res.status(500).json(err);
    }
  });

}
export const getCustomers=(req,res: Response)=>{
  if (!validateRequest<GetCustomers>("GetCustomers", req.query)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input"
    });
    return;
  }
  const query={};
  if (req.query.searchName) {
    query["name"] = {$regex: req.query.searchName, $options:"i"};
  }
  const options = paginateOptions(query,
                                  CustomerProjection,
                                  {},
                                  req.query.limit,
                                  req.query.pagingNext,
                                  req.query.paginatePrevious);
  Customer.paginate(options, err => res.status(500).json(err)).then((result) => {
    res.json(paginateResponse(result));
  });
}

export const getCustomerById=(req:Request,res: Response)=>{
  if (!mongoose.isValidObjectId(req.params.customerId)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid ID supplied"
    });
    return;
  }
  //TODO Not authorized
  Customer.findById(req.params.customerId, CustomerProjection).then(customer => {
    if (customer == null) {
      res.status(404).json({
        errCode: "itemNotFound",
        message: "Product not found"
      });
    } else {
      res.json(customer);
    }
  }, err=> res.status(500).json(err));
}

export const updateCustomer = (req, res: Response) => {
  if (!validateRequest<UpdateCustomer>("UpdateCustomer", req.body)
    || !mongoose.isValidObjectId(req.params.customerId)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input"
    });
    return;
  }
  checkCustomerConsistence(req.body,req.params.customerId).then(() => {
    Customer.findByIdAndUpdate(req.params.customerId, req.body, {new: true}).then(customer => {
      if (customer == null) {
        throw {
          code: 404,
          error: {
            errCode: "itemNotFound",
            message: 'Customer not found'
          }
        };
      } else {
        Log.create({
          username: req.user.username,
          action: "Update",
          object: {
            id: customer._id,
            type: "Customer"
          }
        }).then(() => {
          io.emit("customerChanged", {id: customer._id, action: "update"});
          res.json({message: "Customer updated"})
        });
      }
    });
  }).catch(err => {
    if (err.code && err.error) {
      res.status(err.code).json(err.error)
    } else {
      res.status(500).json(err);
    }
  });
}
export const deleteCustomer=(req,res: Response)=>{
  if (!mongoose.isValidObjectId(req.params.customerId)) {
    res.status(400).send({
      errCode: "invalidArgument",
      message: "Invalid ID supplied"
    });
    return;
  }
  Order.findOne({"customer.id": req.params.customerId}).then(order=>{
    if (order) {
      throw {
        code: 403,
        error: {
          errCode: "cannotDelete",
          message: "Can't delete customer: the customer has associated orders"
        }
      };
    }
  }).then(() => {
    Customer.findByIdAndDelete(req.params.customerId).then(customer => {
      if (customer == null) {
        throw {
          code: 404,
          error: {
            errCode: "itemNotFound",
            message: "Customer not found"
          }
        };
      } else {
        Log.create({
          username: req.user.username,
          action: "Delete",
          object: {
            id: customer._id,
            type: "Customer"
          }
        }).then(() => {
          io.emit("customerChanged", {id: customer._id, action: "delete"});
          res.json({message: "Customer deleted"})
        });
      }
    });
  }).catch(err => {
    if (err.code && err.error) {
      res.status(err.code).json(err.error)
    } else {
      res.status(500).json(err);
    }
  });
}