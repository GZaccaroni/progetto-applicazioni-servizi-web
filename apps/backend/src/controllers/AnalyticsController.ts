import mongoose, { FilterQuery, PipelineStage, ProjectionType } from "mongoose";
import Order, { OrderDocument } from "@/model/db/Order";
import { validateRequest } from "@common/validation";
import { GetAnalyticsInputSchema } from "@common/validation/json_schema/GetAnalyticsInput";
import { callableUserFunction } from "@/utils";
import { ChartDataType } from "@/model/common/ChartDataType";
import { BackendError } from "@/model/common/BackendError";
import Store from "@/model/db/Store";

export const getAnalytics = callableUserFunction(async (req) => {
  if (!validateRequest(GetAnalyticsInputSchema, req.body)) {
    throw new BackendError("invalidArgument");
  }
  const query: FilterQuery<OrderDocument> = {};
  if (req.body.storeId) {
    if (!mongoose.isValidObjectId(req.body.storeId)) {
      throw new BackendError("invalidArgument", "Invalid store id");
    }
    query["store.id"] = req.body.storeId;
  } else if (!req.user.isAdmin) {
    // Show only authorized store data
    const stores = await Store.find(
      { "authorizations.userId": req.user._id },
      "_id"
    ).lean();
    query["store.id"] = {
      $in: stores.map((elem) => elem._id.toString()),
    };
  }
  if (req.body.customerId) {
    if (!mongoose.isValidObjectId(req.body.customerId)) {
      throw new BackendError("invalidArgument", "Invalid customer id");
    }
    query["customer.id"] = req.body.customerId;
  }
  if (req.body.fromDate) {
    if (!query["date"]) {
      query["date"] = {};
    }
    query["date"]["$gte"] = new Date(req.body.fromDate);
  }
  if (req.body.toDate) {
    if (!query["date"]) {
      query["date"] = {};
    }
    query["date"]["$lte"] = new Date(req.body.toDate);
  }
  const productsConditions = new Array<FilterQuery<OrderDocument>>();
  if (req.body.products?.length) {
    req.body.products.forEach((p) => {
      const condition: FilterQuery<OrderDocument> = {
        "entries.productId": p.productId,
      };
      if (p.variantId) {
        condition["entries.variantId"] = p.variantId;
      } else {
        condition["entries.variantId"] = null;
      }
      productsConditions.push(condition);
    });
    query["$or"] = productsConditions;
  }
  const projection: ProjectionType<OrderDocument> = {
    date: 1,
    name: "$entries.name",
    entries: {
      productId: 1,
      variantId: 1,
    },
  };
  if (req.body.dataType == ChartDataType.Price) {
    projection["value"] = "$entries.price";
  } else {
    projection["value"] = "$entries.quantity";
  }
  const pipeline: PipelineStage[] = [
    { $unwind: "$entries" },
    { $match: query },
    { $project: projection },
    {
      $match: productsConditions?.length ? { $or: productsConditions } : {},
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
      $unwind: {
        path: "$product",
      },
    },
    {
      $addFields: {
        productName: { $ifNull: ["$variant.fullName", "$product.name"] },
      },
    },
    {
      $unset: ["_id", "product", "variant"],
    },
  ];
  const resultData = await Order.aggregate(pipeline);
  return {
    data: resultData,
  };
});
