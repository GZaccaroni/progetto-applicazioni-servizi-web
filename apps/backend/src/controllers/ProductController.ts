import { validateRequest } from "@common/validation";
import Product, {
  ProductDocument,
  ProductProjection,
} from "../model/db/Product";
import Log from "../model/db/Log";
import mongoose, { FilterQuery } from "mongoose";
import { io } from "@/app";
import Order from "../model/db/Order";
import { FindProductsInputSchema } from "@common/validation/json_schema/FindProductsInput";
import { callableUserFunction, DbIdentifiable } from "@/utils";
import { CreateUpdateProductInputSchema } from "@common/validation/json_schema/CreateUpdateProductInput";
import { CreateUpdateProductInput } from "@common/model/network/CreateUpdateProductInput";
import { BackendError } from "@/model/common/BackendError";

const checkProductConsistence = async (
  input: CreateUpdateProductInput,
  productId?: string
) => {
  const product = await Product.findOne({ name: input.name }).lean();
  if (product && !(productId && product._id.toString() == productId)) {
    throw new BackendError("nameAlreadyInUse");
  }
};

function enrichProduct(
  product: CreateUpdateProductInput
): Omit<ProductDocument, keyof DbIdentifiable> {
  const kinds: ProductDocument["kinds"] = product.kinds.map((kind) =>
    Object.assign({ fullName: `${product.name} ${kind.name}` }, kind)
  );
  return Object.assign(product, { kinds });
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
    action: "create",
    object: {
      id: newProduct._id,
      type: "product",
    },
  });
  io.emit("productChanged", { id: newProduct._id, action: "create" });
});

export const findProducts = callableUserFunction(async (req) => {
  if (!validateRequest(FindProductsInputSchema, req.query)) {
    throw new BackendError("invalidArgument");
  }
  const query: FilterQuery<ProductDocument> = {};
  if (req.query.searchName) {
    query["$or"] = [
      { name: { $regex: req.query.searchName, $options: "i" } },
      { "kinds.fullName": { $regex: req.query.searchName, $options: "i" } },
    ];
  }
  return await Product.paginate({
    query,
    paginatedField: "_id",
    sortAscending: false,
    projection: ProductProjection,
    limit: req.query.limit,
    lean: true,
    cursors: {
      next: req.query.pagingNext,
      previous: req.query.pagingPrevious,
    },
  });
});

export const getProductById = callableUserFunction(async (req) => {
  if (!mongoose.isValidObjectId(req.params.productId)) {
    throw new BackendError("invalidArgument", "Invalid id supplied");
  }
  const item = await Product.findById(
    req.params.productId,
    ProductProjection
  ).lean();
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
  const product = await Product.findById(req.params.productId).lean();
  if (product == null) {
    throw new BackendError("itemNotFound");
  }
  const deletedKindId = product.kinds
    .filter((k) => enrichedProduct.kinds.find((x) => x.id == k.id) == null)
    .map((k) => k.id);
  const order = await Order.findOne({
    "entries.variantId": deletedKindId,
  }).lean();
  if (order) {
    throw new BackendError(
      "nonDeletable",
      "Can't delete product kind: the product kind has associated orders"
    );
  }
  const updatedProduct = await Product.updateOne(
    { _id: product._id },
    enrichedProduct,
    {
      new: true,
    }
  );
  if (updatedProduct.matchedCount < 1) {
    throw new BackendError("itemNotFound");
  }
  await Log.create({
    username: req.user.username,
    action: "update",
    object: {
      id: product._id,
      type: "product",
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
  }).lean();
  if (order) {
    throw new BackendError(
      "nonDeletable",
      "Can't delete product: the product has associated orders"
    );
  }
  const productId = req.params.productId;
  const deletedProduct = await Product.deleteOne({ _id: productId });
  if (deletedProduct.deletedCount < 1) {
    throw new BackendError("itemNotFound");
  }
  await Log.create({
    username: req.user.username,
    action: "delete",
    object: {
      id: productId,
      type: "product",
    },
  });
  io.emit("productChanged", { id: productId, action: "delete" });
});
