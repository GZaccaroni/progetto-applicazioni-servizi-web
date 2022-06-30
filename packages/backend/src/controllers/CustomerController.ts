import {Request, Response} from "express";
import {validateRequest} from "../schema/validation";
import {CreateCustomer} from "../schema/type/CreateCustomer";
import {UpdateCustomer} from "../schema/type/UpdateCustomer";

export const addCustomer=(req:Request,res: Response)=>{
  if(!validateRequest<CreateCustomer>("CreateOrder",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  res.send("Add Customer")
}
export const getCustomers=(req:Request,res: Response)=>{
  res.send("Get Customers")
}
export const getCustomerById=(req:Request,res: Response)=>{
  res.send("GetId Customer")
}
export const updateCustomer=(req:Request,res: Response)=>{
  if(!validateRequest<UpdateCustomer>("UpdateOrder",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  res.send("Update Customer valid")
}
export const deleteCustomer=(req:Request,res: Response)=>{
  res.send("Add Customer")
}