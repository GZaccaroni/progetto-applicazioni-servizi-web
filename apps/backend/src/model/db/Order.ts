import mongoose, { ProjectionType, Schema, Types } from "mongoose";
import { mongoosePagination, Pagination } from "@/plugins/mongoose-paginate";
import { NetworkIdentifiable } from "@common/model/network/NetworkIdentifiable";
import { ProductGrade } from "../common/ProductGrade";
import { CustomerDocument } from "@/model/db/Customer";

export type OrderDocument = {
  _id: Types.ObjectId;
  customer?: CustomerDocument & NetworkIdentifiable;
  store: {
    id: string;
    name: string;
  };
  date: Date;
  entries: OrderDocumentEntry[];
  price: number;
  note?: string;
  createdBy: string;
};
export type OrderDocumentEntry = {
  productId: string;
  variantId?: string;
  grade?: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
  price: number;
};
const OrderSchema = new mongoose.Schema<OrderDocument>({
  customer: {
    id: String,
    name: String,
    phoneNumber: String,
    address: String,
    vatNumber: String,
  },
  store: {
    id: String,
    name: String,
  },
  date: Schema.Types.Date,
  entries: [
    {
      _id: false,
      productId: String,
      variantId: String,
      grade: {
        type: String,
        enum: [ProductGrade.First, ProductGrade.Second, ProductGrade.Mixed],
      },
      name: String,
      quantity: Number,
      pricePerUnit: Number,
      price: Number,
    },
  ],
  price: Number,
  note: String,
  createdBy: String,
});

OrderSchema.plugin(mongoosePagination);

export default mongoose.model<OrderDocument, Pagination<OrderDocument>>(
  "order",
  OrderSchema,
  "orders"
);

export const OrderProjection: ProjectionType<OrderDocument> = {
  _id: 0,
  id: "$_id",
  customer: {
    id: 1,
    name: 1,
    phoneNumber: 1,
    address: 1,
    vatNumber: 1,
  },
  store: {
    id: 1,
    name: 1,
  },
  date: 1,
  entries: {
    productId: 1,
    variantId: 1,
    name: 1,
    quantity: 1,
    grade: 1,
    pricePerUnit: 1,
    price: 1,
  },
  price: 1,
  note: 1,
};
