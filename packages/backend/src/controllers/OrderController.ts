import {Request, Response} from "express";
import {validateRequest} from "../model/request/validation";
import {CreateOrder} from "../model/request/type/CreateOrder";
import {UpdateOrder} from "../model/request/type/UpdateOrder";

export const addOrder=(req:Request,res: Response)=>{
  if(!validateRequest<CreateOrder>("CreateOrder",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  res.send("Add Order valid")
}
export const getOrders=(req:Request,res: Response)=>{
  res.send("Get Orders")
}
export const getOrderById=(req:Request,res: Response)=>{
  res.send("GetId Order")
}
export const updateOrder=(req:Request,res: Response)=>{
  if(!validateRequest<UpdateOrder>("UpdateOrder",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  res.send("Update Order valid")
}
export const deleteOrder=(req:Request,res: Response)=>{
  res.send("Add Order")
}