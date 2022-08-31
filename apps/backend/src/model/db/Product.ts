import mongoose, { Types, ProjectionType } from "mongoose";
import { mongoosePagination, Pagination } from "@/plugins/mongoose-paginate";
import { QuantityUnitOfMeasure } from "../common/QuantityUnitOfMeasure";

export type ProductDocument = {
  _id: Types.ObjectId;
  name: string;
  pricePerUnit?: number;
  kinds: ProductDocumentKind[];
  unitOfMeasure: QuantityUnitOfMeasure;
};
export type ProductDocumentKind = {
  id: string;
  name: string;
  fullName: string;
  pricePerUnit?: number;
};

const ProductSchema = new mongoose.Schema<ProductDocument>({
  name: {
    type: String,
    unique: true,
  },
  pricePerUnit: Number,
  kinds: [
    {
      _id: false,
      id: String,
      name: String,
      fullName: String,
      pricePerUnit: Number,
    },
  ],
  unitOfMeasure: {
    type: String,
    enum: [QuantityUnitOfMeasure.Kilogram, QuantityUnitOfMeasure.Piece],
  },
});

export const ProductProjection: ProjectionType<ProductDocument> = {
  _id: 0,
  id: "$_id",
  name: 1,
  pricePerUnit: 1,
  kinds: { id: 1, name: 1, pricePerUnit: 1 },
  unitOfMeasure: 1,
};

ProductSchema.plugin(mongoosePagination);

export default mongoose.model<ProductDocument, Pagination<ProductDocument>>(
  "product",
  ProductSchema,
  "products"
);
