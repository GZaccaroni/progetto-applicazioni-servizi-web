import { Response } from "express";
import { validateRequest } from "@common/validation";
import Product, {
  ProductDocument,
  ProductProjection,
} from "../model/db/Product";
import Log from "../model/db/Log";
import { paginateOptions, paginateResponse } from "@/paginationUtils";
import mongoose, { FilterQuery } from "mongoose";
import { io } from "@/app";
import Order from "../model/db/Order";
import { GetProductsInputSchema } from "@common/validation/json_schema/GetProductsInput";
import { UserRequest } from "@/utils";
import { CreateUpdateProductInputSchema } from "@common/validation/json_schema/CreateUpdateProductInput";
import { CreateUpdateProductInput } from "@common/model/network/CreateUpdateProductInput";

const checkProductConsistence = async (
  input: CreateUpdateProductInput,
  productId?: string
) => {
  const productKindSet = new Set(
    input.kinds.map((productKind) => productKind.name)
  );
  if (productKindSet.size != input.kinds.length) {
    throw {
      code: 400,
      error: { errCode: "invalidArgument", message: "Invalid product kinds" },
    };
  }

  const product = await Product.findOne({ name: input.name });
  if (product && !(productId && product._id.toString() == productId)) {
    throw {
      code: 400,
      error: { errCode: "nameAlreadyInUse", message: "Invalid Product name" },
    };
  }
};

const enrichProduct = (product) => {
  product.kinds.forEach(
    (k, i, self) => (self[i]["fullName"] = product.name + " " + k.name)
  );
  return product;
};

export const addProduct = (req: UserRequest, res: Response) => {
  if (!req.user.isAdmin) {
    res.status(403).json({
      errCode: "notAuthorized",
      message: "User not authorized",
    });
  }
  if (!validateRequest(CreateUpdateProductInputSchema, req.body)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input",
    });
    return;
  }

  const enrichedProduct = enrichProduct(req.body);
  checkProductConsistence(enrichedProduct)
    .then(() => {
      Product.create(enrichedProduct).then((product) => {
        Log.create({
          username: req.user.username,
          action: "Create",
          object: {
            id: product._id,
            type: "Product",
          },
        }).then(() => {
          io.emit("productChanged", { id: product._id, action: "create" });
          res.json("Add Product");
        });
      });
    })
    .catch((err) => {
      if (err.code && err.error) {
        res.status(err.code).json(err.error);
      } else {
        res.status(500).json(err);
      }
    });
};

export const getProducts = (req: UserRequest, res: Response) => {
  if (!validateRequest(GetProductsInputSchema, req.query)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input",
    });
    return;
  }
  const query: FilterQuery<ProductDocument> = {};
  if (req.query.searchName) {
    query["$or"] = [
      { name: { $regex: req.query.searchName, $options: "i" } },
      { "kinds.fullName": { $regex: req.query.searchName, $options: "i" } },
    ];
  }
  const options = paginateOptions(
    query,
    ProductProjection,
    {},
    req.query.limit,
    req.query.pagingNext,
    req.query.paginatePrevious
  );
  Product.paginate(options, (err) => res.status(500).json(err)).then(
    (result) => {
      res.json(paginateResponse(result));
    }
  );
};

export const getProductById = (req: UserRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.productId)) {
    res.status(400).json({
      errCode: "invaliArgument",
      message: "Invalid ID supplied",
    });
    return;
  }
  Product.findById(req.params.productId, ProductProjection)
    .then((product) => {
      if (product == null) {
        throw {
          code: 404,
          error: {
            errCode: "itemNotFound",
            message: "Product not found",
          },
        };
      } else {
        res.json(product);
      }
    })
    .catch((err) => {
      if (err.code && err.error) {
        res.status(err.code).json(err.error);
      } else {
        res.status(500).json(err);
      }
    });
};
export const updateProduct = (req: UserRequest, res: Response) => {
  if (!req.user.isAdmin) {
    res.status(403).json({
      errCode: "notAuthorized",
      message: "User not authorized",
    });
    return;
  }
  if (
    !validateRequest(CreateUpdateProductInputSchema, req.body) ||
    !mongoose.isValidObjectId(req.params.productId)
  ) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input",
    });
    return;
  }
  const enrichedProduct = enrichProduct(req.body);
  checkProductConsistence(enrichedProduct, req.params.productId)
    .then(() => {
      Product.findById(req.params.productId).then((product) => {
        if (product == null) {
          throw {
            code: 404,
            error: {
              errCode: "itemNotFound",
              message: "Product not found",
            },
          };
        } else {
          const deletedKindId = product.kinds
            .filter(
              (k) => enrichedProduct.kinds.find((x) => x.id == k.id) == null
            )
            .map((k) => k.id);
          Order.findOne({ "entries.variantId": deletedKindId })
            .then((order) => {
              if (order) {
                throw {
                  code: 403,
                  error: {
                    errCode: "cannotDelete",
                    message:
                      "Can't delete product kind: the product kind has associated orders",
                  },
                };
              }
            })
            .then(() => {
              Product.findByIdAndUpdate(req.params.productId, enrichedProduct, {
                new: true,
              }).then((product) => {
                if (product == null) {
                  throw {
                    code: 404,
                    error: {
                      errCode: "itemNotFound",
                      message: "Product not found",
                    },
                  };
                } else {
                  Log.create({
                    username: req.user.username,
                    action: "Update",
                    object: {
                      id: product._id,
                      type: "Product",
                    },
                  }).then(() => {
                    io.emit("productChanged", {
                      id: product._id,
                      action: "update",
                    });
                    res.json({ message: "Product updated" });
                  });
                }
              });
            });
        }
      });
    })
    .catch((err) => {
      if (err.code && err.error) {
        res.status(err.code).json(err.error);
      } else {
        res.status(500).json(err);
      }
    });
};
export const deleteProduct = (req: UserRequest, res: Response) => {
  if (!req.user.isAdmin) {
    res.status(403).json({
      errCode: "notAuthorized",
      message: "User not authorized",
    });
    return;
  }
  if (!mongoose.isValidObjectId(req.params.productId)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid ID supplied",
    });
    return;
  }

  Order.findOne({ "entries.productId": req.params.productId })
    .then((order) => {
      if (order) {
        throw {
          code: 403,
          error: {
            errCode: "cannotDelete",
            message: "Can't delete product: the product has associated orders",
          },
        };
      }
    })
    .then(() => {
      Product.findByIdAndDelete(req.params.productId).then((product) => {
        if (product == null) {
          throw {
            code: 404,
            error: {
              errCode: "itemNotFound",
              message: "Product not found",
            },
          };
        } else {
          Log.create({
            username: req.user.username,
            action: "Delete",
            object: {
              id: product._id,
              type: "Product",
            },
          }).then(() => {
            io.emit("productChanged", { id: product._id, action: "delete" });
            res.json({ message: "Product deleted" });
          });
        }
      });
    })
    .catch((err) => {
      if (err.code && err.error) {
        res.status(err.code).json(err.error);
      } else {
        res.status(500).json(err);
      }
    });
};
