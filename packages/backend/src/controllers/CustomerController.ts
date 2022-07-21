import {Request, Response} from "express";
import {validateRequest} from "../model/request/validation";
import {CreateCustomer} from "../model/request/type/CreateCustomer";
import {UpdateCustomer} from "../model/request/type/UpdateCustomer";
import Customer, {CustomerProjection} from "../model/db_model/Customer";
import Log from "../model/db_model/Log";
import {paginateOptions, paginateResponse} from "../paginationUtils";
import mongoose from "mongoose";
import {io} from "../app";

export const addCustomer = (req, res: Response) => {
  if (!validateRequest<CreateCustomer>("CreateCustomer", req.body)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input"
    });
    return;
  }
  Customer.create(req.body).then(
    customer=>{
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
}
export const getCustomers=(req:Request,res: Response)=>{
  if (!req.query.limit) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Bad request"
    });
    return;
  }
  const query={};
  if (req.query.searchName) {
    query["name"] = {$regex: req.query.searchName, $options:"i"};
  }
  const options = paginateOptions(query, CustomerProjection, {}, req.query.limit, req.query.pagingNext, req.query.paginatePrevious);
  Customer.paginate(options, err => res.json(err)).then((result) => {
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
  });
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
  Customer.findByIdAndUpdate(req.params.customerId, req.body, {new: true}, (err, customer) => {
    if (err)
      res.json(err);
    else {
      if (customer == null) {
        res.status(404).send({
          errCode: "itemNotFound",
          message: 'Customer not found'
        });
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
        }, (err) => res.json(err));
      }
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
  Customer.findByIdAndDelete(req.params.customerId,(err,customer)=>{
    if (err)
      res.json(err);
    else {
      if (customer == null) {
        res.status(404).json({
          errCode: "itemNotFound",
          message: "Customer not found"
        });
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
        }, err => res.json(err));
      }
    }
  });
}