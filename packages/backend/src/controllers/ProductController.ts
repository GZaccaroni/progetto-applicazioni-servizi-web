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
import { callableUserFunction } from "@/utils";
import { CreateUpdateProductInputSchema } from "@common/validation/json_schema/CreateUpdateProductInput";
import { CreateUpdateProductInput } from "@common/model/network/CreateUpdateProductInput";
import { BackendError } from "@/model/common/BackendError";

const checkProductConsistence = async (
  input: CreateUpdateProductInput,
  productId?: string
) => {
  const productKindSet = new Set(
    input.kinds.map((productKind) => productKind.name)
  );
  if (productKindSet.size != input.kinds.length) {
    throw new BackendError("invalidArgument");
  }

  const product = await Product.findOne({ name: input.name });
  if (product && !(productId && product._id.toString() == productId)) {
    throw new BackendError("nameAlreadyInUse");
  }
};

function enrichProduct(product: CreateUpdateProductInput): ProductDocument {
  const kinds: ProductDocument["kinds"] = product.kinds.map((kind) =>
    Object.assign({ fullName: `${product.name} ${kind.name}` }, kind)
  );
  return Object.assign({ kinds }, product);
}

export const addProduct = callableUserFunction(async (req) => {
  if (!req.user.isAdmin) {
    throw new BackendError("notAuthorized");
  }
  if (!validateRequest(CreateUpdateProductInputSchema, req.body)) {
    throw new BackendError("invalidArgument");
  }

  const enrichedProduct = enrichProduct(req.body);
  await checkProductConsistence(enrichedProduct);
  const newProduct = await Product.create(enrichedProduct);
  await Log.create({
    username: req.user.username,
    action: "Create",
    object: {
      id: newProduct._id,
      type: "Product",
    },
  });
  io.emit("productChanged", { id: newProduct._id, action: "create" });
});

export const getProducts = callableUserFunction(async (req) => {
  if (!validateRequest(GetProductsInputSchema, req.query)) {
    throw new BackendError("invalidArgument");
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
  const result = await Product.paginate(options);
  return paginateResponse(result);
});

export const getProductById = callableUserFunction(async (req) => {
  if (!mongoose.isValidObjectId(req.params.productId)) {
    throw new BackendError("invalidArgument", "Invalid id supplied");
  }
  const item = await Product.findById(req.params.productId, ProductProjection);
  if (item == null) {
    throw new BackendError("itemNotFound");
  }
  return item;
});
export const updateProduct = callableUserFunction(async (req) => {
  if (!req.user.isAdmin) {
    throw new BackendError("notAuthorized");
  }
  if (
    !validateRequest(CreateUpdateProductInputSchema, req.body) ||
    !mongoose.isValidObjectId(req.params.productId)
  ) {
    throw new BackendError("invalidArgument");
  }
  const enrichedProduct = enrichProduct(req.body);
  await checkProductConsistence(enrichedProduct, req.params.productId);
  const product = await Product.findById(req.params.productId);
  if (product == null) {
    throw new BackendError("itemNotFound");
  }
  const deletedKindId = product.kinds
    .filter((k) => enrichedProduct.kinds.find((x) => x.id == k.id) == null)
    .map((k) => k.id);
  const order = await Order.findOne({ "entries.variantId": deletedKindId });
  if (order) {
    throw new BackendError(
      "nonDeletable",
      "Can't delete product kind: the product kind has associated orders"
    );
  }
  const updatedProduct = Product.findByIdAndUpdate(
    req.params.productId,
    enrichedProduct,
    {
      new: true,
    }
  );
  if (updatedProduct == null) {
    throw new BackendError("itemNotFound");
  }
  await Log.create({
    username: req.user.username,
    action: "Update",
    object: {
      id: product._id,
      type: "Product",
    },
  });
  io.emit("productChanged", {
    id: product._id,
    action: "update",
  });
});
export const deleteProduct = callableUserFunction(async (req) => {
  if (!req.user.isAdmin) {
    throw new BackendError("notAuthorized");
  }
  if (!mongoose.isValidObjectId(req.params.productId)) {
    throw new BackendError("invalidArgument", "Invalid id supplied");
  }

  const order = await Order.findOne({
    "entries.productId": req.params.productId,
  });
  if (order) {
    throw new BackendError(
      "nonDeletable",
      "Can't delete product: the product has associated orders"
    );
  }
  const product = await Product.findByIdAndDelete(req.params.productId);
  if (product == null) {
    throw new BackendError("itemNotFound");
  }
  await Log.create({
    username: req.user.username,
    action: "Delete",
    object: {
      id: product._id,
      type: "Product",
    },
  });
  io.emit("productChanged", { id: product._id, action: "delete" });
});
