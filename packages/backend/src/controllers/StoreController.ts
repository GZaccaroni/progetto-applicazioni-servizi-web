import {Request, Response} from "express";
import {validateRequest} from "../model/request/validation";
import {CreateStore} from "../model/request/type/CreateStore";
import {UpdateStore} from "../model/request/type/UpdateStore";
import Store, {StoreProjection} from "../model/db_model/Store";
import Log from "../model/db_model/Log";
import {paginateOptions, paginateResponse} from "../paginationUtils";
import mongoose from "mongoose";
import {io} from "../app";

export const addStore=(req,res: Response)=>{
  if(!req.user.isAdmin){
    res.status(403).json({message:"User not authorized"});
    return;
  }
  if(!validateRequest<CreateStore>("CreateStore",req.body)){
    res.status(400).json({ message:"Invalid Input"});
    return;
  }
  Store.create(req.body).then(
    store => {
      Log.create({
        username: req.user.username,
        action: "Create",
        object: {
          id: store._id,
          type: "Store"
        }
      }).then(() => {
        io.emit("storeChanged", {id: store._id, action: "create"});
        res.json("Add Store")
      });
    });

}
export const getStores = (req, res: Response) => {
  if (!req.query.limit) {
    res.status(400).json({message: "Bad request"});
    return;
  }
  const query={};
  if(req.query.authorized=="true"){
    query["authorizations.userId"]=req.user.id;
  }
  if (req.query.searchName) {
    query["name"] = {$regex: req.query.searchName};
  }
  const options = paginateOptions(query,StoreProjection,
                                    req.query.limit,
                                    req.query.pagingNext,
                                    req.query.paginatePrevious);
  Store.paginate(options, err => res.json(err)).then((result) => {
    res.json(paginateResponse(result));
  });
}

export const getStoreById=(req:Request,res: Response)=>{
  if (!mongoose.isValidObjectId(req.params.storeId)) {
    res.status(400).json({message: "Invalid ID supplied"});
    return;
  }
  //TODO Not authorized
  Store.findById(req.params.storeId,StoreProjection).then(
    store=>{
      if (store == null) {
        res.status(404).json({message: "Store not found"});
      } else {
        res.json(store);
      }
    }
  );
}
export const updateStore = (req, res: Response) => {
  if(!req.user.isAdmin) {
    res.status(403).json({message: "User not authorized"});
  }
  if (!validateRequest<UpdateStore>("UpdateStore", req.body)
    || !mongoose.isValidObjectId(req.params.storeId)) {
    res.status(400).json({message: "Invalid Input"});
    return;
  }
  Store.findByIdAndUpdate(req.params.storeId, req.body, {new: true}, (err, store) => {
    if (err)
      res.json(err);
    else {
      if (store == null) {
        res.status(404).send({
          message: "Store not found"
        });
      } else {
        Log.create({
          username: req.user.username,
          action: "Update",
          object: {
            id: store._id,
            type: "Store"
          }
        }).then(() => {
          io.emit("storeChanged", {id: store._id, action: "update"});
          res.json({message: "Store Updated"})
        }, (err) => res.json(err));
      }
    }
  });
}

export const deleteStore = (req, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.storeId)) {
    res.status(400).send({message: "Invalid ID supplied"});
    return;
  }
  Store.findByIdAndDelete(req.params.storeId, (err, store) => {
    if (err)
      res.json(err);
    else {
      if (store == null) {
        res.status(404).json({message: "Store not found"});
      } else {
        Log.create({
          username: req.user.username,
          action: "Delete",
          object: {
            id: store._id,
            type: "Store"
          }
        }).then(() => {
          io.emit("storeChanged", {id: store._id, action: "delete"});
          res.json({message: "Store deleted"})
        }, err => res.json(err));
      }
    }
  });
}