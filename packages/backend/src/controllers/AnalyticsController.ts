import { Response } from "express";
import mongoose from "mongoose";
import Order from "../model/db/Order";
import { validateRequest } from "../model/network/validation";
import { GetAnalyticsInputSchema } from "../model/network/json_schema/GetAnalyticsInput";
import { UserRequest } from "../utils";
import { ChartDataType } from "../model/common/ChartDataType";

export const getAnalytics = (req: UserRequest, res: Response) => {
  if (!validateRequest(GetAnalyticsInputSchema, req.query)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input",
    });
    return;
  }
  const query = {};
  if (req.query.storeId) {
    if (mongoose.isValidObjectId(req.query.storeId)) {
      query["store.id"] = req.query.storeId;
    } else {
      res.status(400).json({
        errCode: "invalidArgument",
        message: "Invalid storeId supplied",
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
        message: "Invalid customerId supplied",
      });
      return;
    }
  }
  if (req.query.fromDate) {
    if (!query["date"]) {
      query["date"] = {};
    }
    query["date"]["$gte"] = new Date(req.query.fromDate);
  }
  if (req.query.toDate) {
    if (!query["date"]) {
      query["date"] = {};
    }
    query["date"]["$lte"] = new Date(req.query.toDate);
  }
  const productAndVariant = new Array<any>();
  const products = new Array<any>();
  if (req.query.products?.length) {
    req.query.products.forEach((p) => {
      const productCondition = {
        "entries.productId": p.productId,
      };
      if (p.variantId) {
        productCondition["entries.variantId"] = p.variantId;
        productAndVariant.push(productCondition);
      } else {
        products.push(productCondition);
      }
    });
    query["$or"] = products.concat(productAndVariant);
  }
  const projection = {
    date: 1,
    name: "$entries.name",
    entries: {
      productId: 1,
      variantId: 1,
    },
  };
  if (req.query.dataType == ChartDataType.Price) {
    projection["value"] = "$entries.price";
  } else {
    projection["value"] = "$entries.quantity";
  }
  Order.aggregate([
    { $unwind: "$entries" },
    { $match: query },
    { $project: projection },
    {
      $facet: {
        CategorizedByVariant: [
          {
            $match: productAndVariant?.length
              ? { $or: productAndVariant }
              : { _id: null },
          },
          {
            $group: {
              _id: {
                productId: { $toObjectId: "$entries.productId" },
                variantId: "$entries.variantId",
              },
              value: { $sum: "$value" },
              productData: {
                $push: {
                  date: "$date",
                  value: "$value",
                },
              },
            },
          },
        ],
        CategorizedByProduct: [
          {
            $match: products?.length ? { $or: products } : { _id: null },
          },
          {
            $group: {
              _id: { productId: { $toObjectId: "$entries.productId" } },
              value: { $sum: "$value" },
              productData: {
                $push: {
                  date: "$date",
                  value: "$value",
                },
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        items: {
          $concatArrays: ["$CategorizedByVariant", "$CategorizedByProduct"],
        },
      },
    },
    { $unwind: "$items" },
    { $replaceRoot: { newRoot: "$items" } },
    {
      $lookup: {
        from: "products",
        localField: "_id.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $addFields: {
        variant: {
          $arrayElemAt: [
            {
              $filter: {
                input: { $first: "$product.kinds" },
                as: "kind",
                cond: { $eq: ["$$kind.id", "$_id.variantId"] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        name: { $ifNull: ["$variant.fullName", "$product.name"] },
      },
    },
    {
      $unset: ["_id", "product", "variant"],
    },
  ]).then(
    (analytics) => {
      res.json(analytics);
    },
    (err) => res.status(500).json(err)
  );
};
