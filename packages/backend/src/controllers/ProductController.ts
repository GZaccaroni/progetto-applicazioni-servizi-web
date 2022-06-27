import {Request, Response} from "express";

export const addProduct=(req:Request,res: Response)=>{
  res.send("Add Product")
}
export const getProducts=(req:Request,res: Response)=>{
  res.send("Get Products")
}
export const getProductById=(req:Request,res: Response)=>{
  res.send("GetId Product")
}
export const updateProduct=(req:Request,res: Response)=>{
  res.send("Update Product")
}
export const deleteProduct=(req:Request,res: Response)=>{
  res.send("Add Product")
}



