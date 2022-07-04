import mongoose from "mongoose";
import {mongoosePagination, Pagination} from "mongoose-paginate-ts";
import {GradeEnum, Product, UnitOfMeasureEnum} from "../request/type/Product";

type ProductDocument = mongoose.Document & Product;
const ProductSchema = new mongoose.Schema({
  name: String,
  pricePerUnit: Number,
  grade: GradeEnum,
  kinds: [{
    id: String,
    name: String,
    pricePerUnit: Number
  }],
  unitOfMeasure: UnitOfMeasureEnum
});

ProductSchema.plugin(mongoosePagination);

export default mongoose.model<ProductDocument, Pagination<ProductDocument>>('product', ProductSchema, 'products');