import mongoose from "mongoose";
import {mongoosePagination, Pagination} from "mongoose-paginate-ts";
import {Customer} from "../request/type/Customer";

type CustomerDocument = mongoose.Document & Customer;

const CustomerSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  address: String,
  vatNumber: String
});

CustomerSchema.plugin(mongoosePagination);

export default mongoose.model<CustomerDocument, Pagination<CustomerDocument>>('customer', CustomerSchema, 'customers');