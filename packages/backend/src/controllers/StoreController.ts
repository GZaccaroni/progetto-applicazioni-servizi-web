import {Request, Response} from "express";

export const addStore=(req:Request,res: Response)=>{
  res.send("Add Store")
}
export const getStores=(req:Request,res: Response)=>{
  res.send("Get Stores")
}
export const getStoreById=(req:Request,res: Response)=>{
  res.send("GetId Store")
}
export const updateStore=(req:Request,res: Response)=>{
  res.send("Update Store")
}