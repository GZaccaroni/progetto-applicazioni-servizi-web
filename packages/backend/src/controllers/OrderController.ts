import {Request, Response} from "express";
import {validateRequest} from "../model/request/validation";
import {CreateOrder} from "../model/request/type/CreateOrder";
import {UpdateOrder} from "../model/request/type/UpdateOrder";
import {findCustomerById} from "./CustomerController";
import {findStoreById} from "./StoreController";
import {findProductById} from "./ProductController";
import Order from "../model/db_model/Order";
import Log from "../model/db_model/Log";
import {paginateOptions, paginateResponse} from "../paginationUtils";

export const addOrder=(req,res: Response)=>{
  if(!validateRequest<CreateOrder>("CreateOrder",req.body)){
    res.status(400).json({message:"Invalid Input"});
    return;
  }
  const newOrder={
    storeId:req.body.storeId,
    date: req.body.date,
    entries:[]
  }
  if(req.body.note){
    newOrder["note"]=req.body.note;
  }
  const promises=[]
  //get Store data
  promises.push(findStoreById(req.body.storeId).then(
    store => {
      if (store != null) {
        newOrder["storeName"] = store.name;
      } else {
        throw {code: 400, message:"Invalid Input"};
      }
    }))
  //generate product name
  const entryPromises=[];
  req.body.entries.forEach(entry => {
    entry["price"] = entry.pricePerUnit * entry.quantity;
    entryPromises.push(findProductById(entry.productId).then(product => {
      entry["name"] = product.name + entry.variantId ? " " + product.kinds.find(x => x.id == entry.variantId).name : "";
    }).then(() => newOrder["entries"].push(entry)));
  })
  //compute tot
  promises.push(Promise.all(entryPromises).then(()=>newOrder["price"]=newOrder.entries.reduce((sum,entry)=>sum+entry.price,0)))
  //get Customer data
  if(req.body.customerId){
   promises.push(findCustomerById(req.body.customerId).then(customer=>{
      if(customer!=null){
        newOrder["customer"]=customer;
      } else {
        throw {code: 400, message: "Invalid Input"};
      }
   }));
  }
  Promise.all(promises).then(() => {
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
  if(req.query.storeId){
    query["storeId"]=req.query.storeId;
  }
  if (req.query.fromDate) {
    query["date"]["$gte"]= req.query.fromDate;
  }
  if (req.query.toDate) {
    query["date"]["$lte"]= req.query.toDate;
  }
  const options = paginateOptions(query,{},
    req.query.limit,
    req.query.pagingNext,
    req.query.paginatePrevious);
  Order.paginate(options, err => res.json(err)).then((result) => {
    res.json(paginateResponse(result));
  });
}
export const getOrderById=(req:Request,res: Response)=>{
  if (!req.params.orderId) {
    res.status(400).json({message: "Invalid ID supplied"});
    return;
  }
  //TODO Not authorized
  Order.findById(req.params.orderId,(err,order)=>{
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
  if(!validateRequest<UpdateOrder>("UpdateOrder",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  const newOrder={
    storeId:req.body.storeId,
    date: req.body.date,
    entries:[]
  }
  if(req.body.note){
    newOrder["note"]=req.body.note;
  }
  const promises=[]
  //get Store data
  promises.push(findStoreById(req.body.storeId).then(
    store => {
      if (store != null) {
        newOrder["storeName"] = store.name;
      } else {
        throw {code: 400, message:"Invalid Input"};
      }
    }))
  //generate product name
  const entryPromises=[];
  req.body.entries.forEach( entry=>{
    entry["price"]=entry.pricePerUnit*entry.quantity;
    entryPromises.push(findProductById(entry.productId).then(product=>{
      entry["name"] = product.name + entry.variantId ? " " + product.kinds.find(x => x.id == entry.variantId).name : "";
    }).then(()=>newOrder["entries"].push(entry)));
  })
  //compute tot
  promises.push(Promise.all(entryPromises).then(()=>newOrder["price"]=newOrder.entries.reduce((sum,entry)=>sum+entry.price,0)))
  //get Customer data
  if(req.body.customerId){
    promises.push(findCustomerById(req.body.customerId).then(customer=>{
      if(customer!=null){
        newOrder["customer"]=customer;
      } else {
        throw {code: 400, message: "Invalid Input"};
      }
    }));
  }
  Promise.all(promises).then(() => {
    Order.findByIdAndUpdate(req.body.id,newOrder).then(order => {
      Log.create({
        username: req.user.username,
        action: "Update",
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
export const deleteOrder=(req,res: Response)=>{
  if (!req.params.orderId) {
    res.status(400).send({message: "Invalid ID supplied"});
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
  res.send("Add Order")
}