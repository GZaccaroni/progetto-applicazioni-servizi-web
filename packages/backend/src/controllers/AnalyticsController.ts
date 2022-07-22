import { Response} from "express";
import mongoose from "mongoose";
import Order from "../model/db_model/Order";
import {validateRequest} from "../model/request/validation";
import {GetAnalytics} from "../model/request/type/GetAnalytics";

export const getAnalytics = (req, res: Response) => {
  if (!validateRequest<GetAnalytics>("GetAnalytics", req.query)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input"
    });
    return;
  }
  const query={};
  if(req.query.storeId ){
    if(mongoose.isValidObjectId(req.query.storeId)) {
      query["store.id"] = req.query.storeId;
    } else {
      res.status(400).json({
        errCode: "invalidArgument",
        message: "Invalid storeId supplied"
      });
      return;
    }
  }
  if (req.query.customerId) {
    if (mongoose.isValidObjectId(req.query.customerId)) {
      query["customer.id"] = req.query.customerId;
    } else {
      res.status(400).json({
        errCode: "invalidArgument",
        message: "Invalid customerId supplied"
      });
      return;
    }
  }
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
  const productAndVariant=[];
  const products=[]
  if (req.query.products?.length) {
      req.query.products.forEach(p => {
      const productCondition = {
        "entries.productId": p.productId
      };
      if (p.variantId) {
        productCondition["entries.variantId"] = p.variantId;
        productAndVariant.push(productCondition)
      } else {
        products.push(productCondition)
      }
    });
    query["$or"]=products.concat(productAndVariant)
  }
  const projection={
    date:1,
    name:"$entries.name",
    entries:{
      productId:1,
      variantId:1
    }
  };
  if (req.query.dataType == "price") {
    projection["value"] = "$entries.price";
  } else {
    projection["value"] = "$entries.quantity";
  }
  Order.aggregate([
    {$unwind: "$entries"},
    {$match: query},
    {$project: projection},
    {
      $facet: {
        "CategorizedByVariant":[
          {
            $match: productAndVariant?.length?{$or:productAndVariant}:{_id:null},
          },
          {
            $group: {
              _id: {
                productId: {$toObjectId: "$entries.productId"},
                variantId: "$entries.variantId"
              },
              "value": {$sum: "$value"},
              "productData": {
                $push: {
                  "date": "$date",
                  "value": "$value"
                }
              }
            }
          }
        ],
        "CategorizedByProduct":[
          {
            $match: products?.length?{$or:products}:{_id:null}
          },
          {
            $group: {
              _id: {productId: {$toObjectId: "$entries.productId"}},
              "value": {$sum: "$value"},
              "productData": {
                $push: {
                  "date": "$date",
                  "value": "$value"
                }
              }
            }
          }
        ]
      }
    },
    {$project: {"items": {$concatArrays: ["$CategorizedByVariant", "$CategorizedByProduct"]}}},
    {$unwind: "$items"},
    {$replaceRoot: {newRoot: "$items"}},
    {
      $lookup: {
        from: "products",
        localField: "_id.productId",
        foreignField: "_id",
        as: "product"
      }
    },
    {
      $addFields: {
        "variant": {$arrayElemAt: [{
            $filter: {
              input: {$first:"$product.kinds"},
              as: "kind",
              cond: {$eq: ["$$kind.id", "$_id.variantId"]}
            }}, 0]}
      }
    },
    {
      $addFields: {
        "name": {$ifNull: ["$variant.fullName", "$product.name"]}
      }
    },
    {
      $unset:["_id","product","variant"]
    }
  ]).then(r => {
    res.json(r)
  });
}