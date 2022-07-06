import mongoose from "mongoose";
import {mongoosePagination, Pagination} from "mongoose-paginate-ts";
import {GradeEnum, Product, UnitOfMeasureEnum} from "../request/type/Product";

type ProductDocument = mongoose.Document & Product;
const ProductSchema = new mongoose.Schema({
  name: String,
  pricePerUnit: Number,
  grade:{
    type:String,
    enum: [GradeEnum.First,GradeEnum.Second,GradeEnum.Mixed]
  },
  kinds: [{
    id: String,
    name: String,
    pricePerUnit: Number
  }],
  unitOfMeasure: {
    type:String,
    enum: [UnitOfMeasureEnum.Kilogram,UnitOfMeasureEnum.Piece]
  }
});

ProductSchema.plugin(mongoosePagination);

export default mongoose.model<ProductDocument, Pagination<ProductDocument>>('product', ProductSchema, 'products');