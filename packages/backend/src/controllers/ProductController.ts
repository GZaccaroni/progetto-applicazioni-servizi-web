import {Request, Response} from "express";
import {validateRequest} from "../model/request/validation";
import {UpdateProduct} from "../model/request/type/UpdateProduct";
import {CreateProduct} from "../model/request/type/CreateProduct";
import Product, {ProductProjection} from "../model/db_model/Product";
import Log from "../model/db_model/Log";
import {paginateOptions, paginateResponse} from "../paginationUtils";
import mongoose from "mongoose";
import {io} from "../app";

const enrichProduct=(product)=>{
  product.kinds.forEach((k,i,self)=>self[i]["fullName"]=product.name+" "+k.name);
  return product;
}

export const addProduct=(req,res: Response)=>{
  if (!req.user.isAdmin) {
    res.status(403).json({
      errCode: "notAuthorized",
      message: "User not authorized"});
  }
  if (!validateRequest<CreateProduct>("CreateProduct", req.body)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input"
    });
    return;
  }
  const enrichedProduct=enrichProduct(req.body);
  Product.create(enrichedProduct).then(product=>{
    Log.create({
      username: req.user.username,
      action: "Create",
      object: {
        id: product._id,
        type: "Product"
      }
    }).then(() => {
      io.emit("productChanged", {id: product._id, action: "create"});
      res.json("Add Product")
    });
  });


}
export const getProducts = (req, res: Response) => {
  if (!req.query.limit) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Bad request"});
    return;
  }
  const query = {};
  if (req.query.searchName) {
    query["$or"] = [{"name":{$regex: req.query.searchName, $options: "i"}},{"kinds.fullName":{$regex:req.query.searchName, $options:"i"}}];
  }
  const options = paginateOptions(query, ProductProjection,req.query.limit,
    req.query.pagingNext,
    req.query.paginatePrevious);
  Product.paginate(options, err => res.json(err)).then((result) => {
    res.json(paginateResponse(result));
  });
}

export const getProductById = (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.productId)) {
    res.status(400).json({
      errCode: "invaliArgument",
      message: "Invalid ID supplied"
    });
    return;
  }
  //TODO Not authorized
  Product.findById(req.params.productId, ProductProjection).then(product => {
    if (product == null) {
      res.status(404).json({
        errCode: "itemNotFound",
        message: "Product not found"
      });
    } else {
      res.json(product);
    }
  }).catch(err=>res.json(err));
}
export const updateProduct=(req,res: Response)=>{
  if(!req.user.isAdmin){
    res.status(403).json({
      errCode: "notAuthorized",
      message:"User not authorized"});
  }
  if (!validateRequest<UpdateProduct>("UpdateProduct", req.body)
    || !mongoose.isValidObjectId(req.params.productId)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message:"Invalid Input"
    });
    return;
  }
  const enrichedProduct=req.body;
  Product.findByIdAndUpdate(req.params.productId, enrichedProduct, {new: true}, (err, product) => {
    if (err)
      res.json(err);
    else {
      if (product == null) {
        res.status(404).send({
          message: 'Product not found'
        });
      } else {
        Log.create({
          username: req.user.username,
          action: "Update",
          object: {
            id: product._id,
            type: "Product"
          }
        }).then(() => {
          io.emit("productChanged", {id: product._id, action: "update"});
          res.json({message: "Product updated"})
        }, (err) => res.json(err));
      }
    }
  });
}
export const deleteProduct=(req,res: Response)=>{
  if (!mongoose.isValidObjectId(req.params.productId)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid ID supplied"
    });
    return;
  }
  Product.findByIdAndDelete(req.params.productId, (err, product) => {
    if (err)
      res.json(err);
    else {
      if (product == null) {
        res.status(404).json({
          errCode: "itemNotFound",
          message: "Product not found"
        });
      } else {
        Log.create({
          username: req.user.username,
          action: "Delete",
          object: {
            id: product._id,
            type: "Product"
          }
        }).then(() => {
          io.emit("productChanged", {id:product._id, action:"delete"});
          res.json({message: "Product deleted"})
        }, err => res.json(err));
      }
    }
  });
}



