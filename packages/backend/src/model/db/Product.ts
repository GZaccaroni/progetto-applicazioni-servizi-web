import mongoose, { ProjectionType } from "mongoose";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";
import { QuantityUnitOfMeasure } from "../common/QuantityUnitOfMeasure";

export type ProductDocument = {
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
