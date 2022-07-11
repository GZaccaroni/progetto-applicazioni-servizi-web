import {Request, Response} from "express";
import {validateRequest} from "../model/request/validation";
import {CreateOrder} from "../model/request/type/CreateOrder";
import {UpdateOrder} from "../model/request/type/UpdateOrder";
import Order, {OrderProjection} from "../model/db_model/Order";
import Log from "../model/db_model/Log";
import {paginateOptions, paginateResponse} from "../paginationUtils";
import Store from "../model/db_model/Store";
import Product from "../model/db_model/Product";
import Customer, {CustomerProjection} from "../model/db_model/Customer";
import mongoose from "mongoose";

const enrichOrder = async (order)=>{
  const enrichedOrder={
    storeId:order.storeId,
    date: order.date,
    entries:[]
  }
  if(order.note){
    enrichedOrder["note"]=order.note;
  }
  const promises=[]
  //get Store data
  promises.push(Store.findById(order.storeId).then(
    store => {
      if (store != null) {
        enrichedOrder["storeName"] = store.name;
      } else {
        throw {code: 400, message:"Invalid Input"};
      }
    }))
  //generate product name
  const entryPromises=[];
  order.entries.forEach(entry => {
    entry["price"] = entry.pricePerUnit * entry.quantity;
    entryPromises.push(Product.findById(entry.productId).then(product => {
      let productFullName=product.name;
      if(entry.variantId){
        productFullName+=" "+product.kinds.find(x => x.id == entry.variantId).name;
      }
      entry["name"] = productFullName;
    }).then(() => enrichedOrder["entries"].push(entry)));
  })
  //compute tot
  promises.push(Promise.all(entryPromises).then(() => enrichedOrder["price"] = enrichedOrder.entries.reduce((sum, entry) => sum + entry.price, 0)).catch(err=>console.log(err)))
  //get Customer data
  if (order.customerId) {
    promises.push(Customer.findById(order.customerId,CustomerProjection).then(customer=>{
      if(customer!=null){
        enrichedOrder["customer"]=customer;
      } else {
        throw {code: 400, message: "Invalid Input"};
      }
    }));
  }
  await Promise.all(promises).catch(err=>console.log(err));
  return enrichedOrder;
}

export const addOrder=(req,res: Response)=>{
  if(!validateRequest<CreateOrder>("CreateOrder",req.body)){
    res.status(400).json({message:"Invalid Input"});
    return;
  }
  //TODO Not authorized
  enrichOrder(req.body).then(newOrder => {
    Order.create(newOrder).then(order => {
      Log.create({
        username: req.user.username,
        action: "Create",
        object: {
          id: order._id,
          type: "Order"
        }
      }).then(() => res.json("Add Order"));
    })
  }).catch(err => {
    if(err.code && err.message){
      res.status(err.code).json({message: err.message})
    } else {
      res.status(500).json(err);
    }
  });
}
export const getOrders=(req,res: Response)=>{
  if (!req.query.limit) {
    res.status(400).json({message: "Bad request"});
    return;
  }
  const query={};
  if(req.query.storeId ){
    if(mongoose.isValidObjectId(req.query.storeId)) {
      query["storeId"] = req.query.storeId;
    } else {
      res.status(400).json({message: "Bad request"});
    }
  }
  //TODO check correct date format
  if (req.query.fromDate) {
    if(!query["date"]){
      query["date"]={};
    }
    query["date"]["$gte"] = new Date(req.query.fromDate);
  }
  if (req.query.toDate) {
    if(!query["date"]){
      query["date"]={};
    }
    query["date"]["$lte"] = new Date(req.query.toDate);
  }
  const options = paginateOptions(query,OrderProjection,
    req.query.limit,
    req.query.pagingNext,
    req.query.paginatePrevious);
  Order.paginate(options, err => res.json(err)).then((result) => {
    res.json(paginateResponse(result));
  });
}
export const getOrderById=(req:Request,res: Response)=>{
  if (!mongoose.isValidObjectId(req.params.orderId)) {
    res.status(400).json({message: "Invalid ID supplied"});
    return;
  }
  //TODO Not authorized
  Order.findById(req.params.orderId,OrderProjection,(err,order)=>{
    if (err) {
      res.json(err);
    } else {
      if(order==null){
        res.status(404).json({message: "Order not found"});
      } else {
        res.json(order);
      }
    }
  });
}
export const updateOrder=(req,res: Response)=>{
  if(!validateRequest<UpdateOrder>("UpdateOrder",req.body)
    || !mongoose.isValidObjectId(req.params.orderId)
    || req.params.orderId!=req.body.id){
    res.status(400).json("Invalid Input");
    return;
  }

  enrichOrder(req.body).then( newOrder => {
    Order.findOneAndReplace({_id:req.params.orderId},newOrder).then(order => {
      Log.create({
        username: req.user.username,
        action: "Update",
        object: {
          id: order._id,
          type: "Order"
        }
      }).then(() => res.json("Order Updated"));
    })
  }).catch(err => {
    if(err.code && err.message){
      res.status(err.code).json({message: err.message})
    } else {
      res.status(500).json(err);
    }
  });

}
export const deleteOrder=(req,res: Response)=>{
  if (!mongoose.isValidObjectId(req.params.orderId)) {
    res.status(400).json({message: "Invalid ID supplied"});
    return;
  }
  //TODO not authorized
  Order.findByIdAndDelete(req.params.orderId,(err,order)=>{
    if (err)
      res.json(err);
    else {
      if (order == null) {
        res.status(404).json({message: "Order not found"});
      } else {
        Log.create({
          username: req.user.username,
          action: "Delete",
          object: {
            id: order._id,
            type: "Order"
          }
        }).then(() => res.json({message: "Order deleted"}), err => res.json(err));
      }
    }
  })
}