import {Request, Response} from "express";

export const addOrder=(req:Request,res: Response)=>{
  res.send("Add Order")
}
export const getOrders=(req:Request,res: Response)=>{
  res.send("Get Orders")
}
export const getOrderById=(req:Request,res: Response)=>{
  res.send("GetId Order")
}
export const updateOrder=(req:Request,res: Response)=>{
  res.send("Update Order")
}
export const deleteOrder=(req:Request,res: Response)=>{
  res.send("Add Order")
}