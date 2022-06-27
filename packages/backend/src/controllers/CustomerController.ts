import {Request, Response} from "express";

export const addCustomer=(req:Request,res: Response)=>{
  res.send("Add Customer")
}
export const getCustomers=(req:Request,res: Response)=>{
  res.send("Get Customers")
}
export const getCustomerById=(req:Request,res: Response)=>{
  res.send("GetId Customer")
}
export const updateCustomer=(req:Request,res: Response)=>{
  res.send("Update Customer")
}
export const deleteCustomer=(req:Request,res: Response)=>{
  res.send("Add Customer")
}