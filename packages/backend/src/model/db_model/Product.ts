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

export const ProductProjection= { _id: 0,
  id: '$_id',
  name: 1,
  pricePerUnit: 1,
  grade: 1,
  kinds: {id: 1, name: 1, pricePerUnit: 1},
  unitOfMeasure: 1
}

ProductSchema.plugin(mongoosePagination);

export default mongoose.model<ProductDocument, Pagination<ProductDocument>>('product', ProductSchema, 'products');