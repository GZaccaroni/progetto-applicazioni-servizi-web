import mongoose, { FilterQuery } from "mongoose";
import Order, { OrderDocument } from "@/model/db/Order";
import { validateRequest } from "@common/validation";
import { GetAnalyticsInputSchema } from "@common/validation/json_schema/GetAnalyticsInput";
import { callableUserFunction } from "@/utils";
import { ChartDataType } from "@/model/common/ChartDataType";
import { BackendError } from "@/model/common/BackendError";

export const getAnalytics = callableUserFunction(async (req) => {
  if (!validateRequest(GetAnalyticsInputSchema, req.query)) {
    throw new BackendError("invalidArgument");
  }
  const query: FilterQuery<OrderDocument> = {};
  if (req.query.storeId) {
    if (!mongoose.isValidObjectId(req.query.storeId)) {
      throw new BackendError("invalidArgument", "Invalid store id");
    }
    query["store.id"] = req.query.storeId;
  } else {
    if (!req.user.isAdmin) {
      throw new BackendError("notAuthorized");
    }
  }
  if (req.query.customerId) {
    if (!mongoose.isValidObjectId(req.query.customerId)) {
      throw new BackendError("invalidArgument", "Invalid customer id");
    }
    query["customer.id"] = req.query.customerId;
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
  const productAndVariantConditions = new Array<FilterQuery<OrderDocument>>();
  const productsConditions = new Array<FilterQuery<OrderDocument>>();
  if (req.query.products?.length) {
    req.query.products.forEach((p) => {
      const productCondition = {
        "entries.productId": p.productId,
      };
      if (p.variantId) {
        productCondition["entries.variantId"] = p.variantId;
        productAndVariantConditions.push(productCondition);
      } else {
        productsConditions.push(productCondition);
      }
    });
    query["$or"] = productsConditions.concat(productAndVariantConditions);
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
  return Order.aggregate([
    { $unwind: "$entries" },
    { $match: query },
    { $project: projection },
    {
      $facet: {
        CategorizedByVariant: [
          {
            $match: productAndVariantConditions?.length
              ? { $or: productAndVariantConditions }
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
            $match: productsConditions?.length
              ? { $or: productsConditions }
              : { _id: null },
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
  ]);
});
