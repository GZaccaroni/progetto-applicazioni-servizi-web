import {Request, Response} from "express";
import {validateRequest} from "../schema/validation";
import {CreateStore} from "../schema/type/CreateStore";
import {UpdateStore} from "../schema/type/UpdateStore";

export const addStore=(req:Request,res: Response)=>{
  if(!validateRequest<CreateStore>("CreateStore",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  res.send("Add Store valid")
}
export const getStores=(req:Request,res: Response)=>{
  res.send("Get Stores")
}
export const getStoreById=(req:Request,res: Response)=>{
  res.send("GetId Store")
}
export const updateStore=(req:Request,res: Response)=>{
  if(!validateRequest<UpdateStore>("UpdateStore",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  res.send("Update Store valid")
}