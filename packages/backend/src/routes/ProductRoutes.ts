import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "@/controllers/ProductController";

const ProductRoutes = Router();

ProductRoutes.route("/").post(addProduct);

ProductRoutes.route("/find").get(getProducts);

ProductRoutes.route("/:productId")
  .get(getProductById)
  .post(updateProduct)
  .delete(deleteProduct);

export default ProductRoutes;
