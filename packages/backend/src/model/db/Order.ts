import mongoose from "mongoose";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";
import { NetworkCustomer } from "../network/type/NetworkCustomer";
import { Identifiable } from "../network/type/Identifiable";
import { ProductGrade } from "../common/ProductGrade";

export type OrderDocument = {
  customer?: NetworkCustomer & Identifiable;
  store: {
    id: string;
    name: string;
  };
  date: Date;
  entries: [
    {
      productId: string;
      variantId?: string;
      grade?: string;
      name: string;
      quantity: number;
      pricePerUnit: number;
      price: number;
    }
  ];
  price: number;
  note?: string;
  createdBy: string;
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
  date: Date,
  entries: [
    {
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

export const OrderProjection = {
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
