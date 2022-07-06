import {Request, Response} from "express";
import {validateRequest} from "../model/request/validation";
import {UpdateProduct} from "../model/request/type/UpdateProduct";
import {CreateProduct} from "../model/request/type/CreateProduct";
import Product from "../model/db_model/Product";
import Log from "../model/db_model/Log";
import {paginateOptions, paginateResponse} from "../paginationUtils";

export const addProduct=(req,res: Response)=>{
  if (!req.user.isAdmin) {
    res.status(403).json({message: "User not authorized"});
  }
  if (!validateRequest<CreateProduct>("CreateProduct",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  Product.create(req.body).then(product=>{
    Log.create({
      username: req.user.username,
      action: "Create",
      object: {
        id: product._id,
        type: "Product"
      }
    }).then(() => res.json("Add Product"));
  });


}
export const getProducts = (req, res: Response) => {
  if (!req.query.limit) {
    res.status(400).json({message: "Bad request"});
    return;
  }
  const query = {};
  if (req.query.searchName) {
    query["name"] = {$regex: req.query.searchName};
  }
  const options = paginateOptions(query, {},
    req.query.limit,
    req.query.pagingNext,
    req.query.paginatePrevious);
  Product.paginate(options, err => res.json(err)).then((result) => {
    res.json(paginateResponse(result));
  });
}

export const findProductById = async (productId: string) => {
  return Product.findById(productId, {}, (err, product) => {
    if (err) {
      throw err;
    } else {
      return product;
    }
  });
}

export const getProductById = (req: Request, res: Response) => {
  if (!req.params.productId) {
    res.status(400).json({message: "Invalid ID supplied"});
    return;
  }
  //TODO Not authorized
  findProductById(req.params.productId).then(product => {
    if (product == null) {
      res.status(404).json({message: "Product not found"});
    } else {
      res.json(product);
    }
  });
}
export const updateProduct=(req,res: Response)=>{
  if(!req.user.isAdmin){
    res.status(403).json({message:"User not authorized"});
  }
  if (!validateRequest<UpdateProduct>("UpdateProduct", req.body) || !req.params.productId) {
    res.status(400).send("Invalid Input");
    return;
  }
  Product.findByIdAndUpdate(req.params.productId, req.body, {new: true}, (err, product) => {
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
        }).then(() => res.json(product), (err) => res.json(err));
      }
    }
  });
}
export const deleteProduct=(req,res: Response)=>{
  if (!req.params.productId) {
    res.status(400).send({message: "Invalid ID supplied"});
    return;
  }
  Product.findByIdAndDelete(req.params.productId, (err, product) => {
    if (err)
      res.json(err);
    else {
      if (product == null) {
        res.status(404).json({message: "Product not found"});
      } else {
        Log.create({
          username: req.user.username,
          action: "Delete",
          object: {
            id: product._id,
            type: "Product"
          }
        }).then(() => res.json({message: "Product deleted"}), err => res.json(err));
      }
    }
  });
}



