import {Request, Response} from "express";
import {validateRequest} from "../model/request/validation";
import {CreateCustomer} from "../model/request/type/CreateCustomer";
import {UpdateCustomer} from "../model/request/type/UpdateCustomer";
import Customer from "../model/db_model/Customer";
import Log from "../model/db_model/Log";
import {paginateOptions, paginateResponse} from "../paginationUtils";

export const addCustomer=(req,res: Response)=>{
  if(!validateRequest<CreateCustomer>("CreateCustomer",req.body)){
    res.status(400).json({ message:"Invalid Input"});
    return;
  }
  Customer.create(req.body).then(
    customer=>{
      Log.create({
        username: req.user.username,
        action: "Create",
        objectId: customer._id
      }).then(() => res.json("Add Customer"));
    });
}
export const getCustomers=(req:Request,res: Response)=>{
  if (!req.query.limit) {
    res.status(400).json({message: "Bad request"});
    return;
  }
  const query={};
  if (req.query.searchName) {
    query["name"] = {$regex: req.query.searchName};
  }
  const options = paginateOptions(query,{},
    req.query.limit,
    req.query.pagingNext,
    req.query.paginatePrevious);
  Customer.paginate(options, err => res.json(err)).then((result) => {
    res.json(paginateResponse(result));
  });
}
export const getCustomerById=(req:Request,res: Response)=>{
  if (!req.params.customerId) {
    res.status(400).json({message: "Invalid ID supplied"});
    return;
  }
  //TODO Not authorized
  Customer.findById( req.params.storeId, ["name", "authorizations", "_id"], (err, customer) => {
    if (err) {
      res.json(err);
    } else {
      if (customer == null) {
        res.status(404).json({message: "Store not found"});
      } else {
        res.json(customer);
      }
    }
  });
}
export const updateCustomer=(req,res: Response)=>{
  if(!validateRequest<UpdateCustomer>("UpdateCustomer",req.body) || !req.params.customerId){
    res.status(400).json({message:"Invalid Input"});
    return;
  }
  Customer.findByIdAndUpdate(req.params.customerId, req.body, {new: true}, (err, customer) => {
    if (err)
      res.json(err);
    else {
      if (customer == null) {
        res.status(404).send({
          message: 'Customer not found'
        });
      } else {
        Log.create({
          username: req.user.username,
          action: "Update",
          objectId: customer._id
        }).then(() => res.json(customer), (err) => res.json(err));
      }
    }
  });
}
export const deleteCustomer=(req,res: Response)=>{
  if (!req.params.customerId) {
    res.status(400).send({message: "Invalid ID supplied"});
    return;
  }
  Customer.findByIdAndDelete(req.params.customerId,{},(err,customer)=>{
    if (err)
      res.json(err);
    else {
      if (customer == null) {
        res.status(404).json({message: "Customer not found"});
      } else {
        Log.create({
          username: req.user.username,
          action: "Delete",
          objectId: customer._id
        }).then(() => res.json({message: "Customer deleted"}), err => res.json(err));
      }
    }
  });
}