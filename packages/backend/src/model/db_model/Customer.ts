import mongoose from "mongoose";
import {mongoosePagination, Pagination} from "mongoose-paginate-ts";
import {Customer} from "../request/type/Customer";

type CustomerDocument = mongoose.Document & Customer;

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  phoneNumber: String,
  address: String,
  vatNumber: String
});

CustomerSchema.plugin(mongoosePagination);

export default mongoose.model<CustomerDocument, Pagination<CustomerDocument>>('customer', CustomerSchema, 'customers');

export const CustomerProjection= { _id: 0,
  id: '$_id',
  name: 1,
  phoneNumber: 1,
  address: 1,
  vatNumber: 1

}
