import {Request, Response} from "express";
import {validateRequest} from "../model/request/validation";
import {UpdateProduct} from "../model/request/type/UpdateProduct";
import {CreateProduct} from "../model/request/type/CreateProduct";

export const addProduct=(req:Request,res: Response)=>{
  if(!validateRequest<CreateProduct>("CreateProduct",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  res.send("Add Product Validated")

}
export const getProducts=(req:Request,res: Response)=>{
  res.send("Get Products")
}
export const getProductById=(req:Request,res: Response)=>{
  res.send("GetId Product")
}
export const updateProduct=(req:Request,res: Response)=>{
  if(!validateRequest<UpdateProduct>("UpdateProduct",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  res.send("Update Product Validated");
}
export const deleteProduct=(req:Request,res: Response)=>{
  res.send("Delete Product")
}



