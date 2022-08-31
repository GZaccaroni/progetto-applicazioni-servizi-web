import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProductById,
  findProducts,
  updateProduct,
} from "@/controllers/ProductController";

const ProductRoutes = Router();

ProductRoutes.route("/").post(addProduct);

ProductRoutes.route("/find").get(findProducts);

ProductRoutes.route("/:productId")
  .get(getProductById)
  .post(updateProduct)
  .delete(deleteProduct);

export default ProductRoutes;
