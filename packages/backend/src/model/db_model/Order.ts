import mongoose from "mongoose";
import {mongoosePagination, Pagination} from "mongoose-paginate-ts";
import {Customer} from "../request/type/Customer";
import {Identifiable} from "../request/type/Identifiable";

type OrderDocument = mongoose.Document & {
  customer?: Customer & Identifiable;
  storeId: string;
  storeName: string;
  date: Date;
  entries: [{
    productId: string;
    variantId?: string;
    name: string;
    quantity: number;
    pricePerUnit: number;
    price: number;
  }];
  price: number;
  note?: string;
};

const OrderSchema = new mongoose.Schema({
  customer:{
    id: String,
    name: String,
    phoneNumber: String,
    address: String,
    vatNumber: String
  },
  storeId: String,
  storeName: String,
  date: Date,
  entries: [{
    productId: String,
    variantId: String,
    name: String,
    quantity: Number,
    pricePerUnit: Number,
    price: Number
  }],
  price: Number,
  note: String
});

OrderSchema.plugin(mongoosePagination);

export default mongoose.model<OrderDocument, Pagination<OrderDocument>>('order', OrderSchema, 'orders');