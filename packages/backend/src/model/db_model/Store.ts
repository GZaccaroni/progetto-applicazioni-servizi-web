import mongoose from "mongoose";
import {mongoosePagination, Pagination} from "mongoose-paginate-ts";
import {Store} from "../request/type/Store";
import {AccessLevel} from "../request/type/StoreAuthorization";

type StoreDocument = mongoose.Document & Store;
const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  authorizations: [{
    userId: String,
    accessLevel: {
      type: String,
      enum: [AccessLevel.Salesman, AccessLevel.Manager]
    }
  }]
});

StoreSchema.plugin(mongoosePagination);

export default mongoose.model<StoreDocument, Pagination<StoreDocument>>('store', StoreSchema, 'stores');

export const StoreProjection = {
  _id: 0,
  id: '$_id',
  name: 1,
  authorizations: {
    userId: 1,
    accessLevel: 1
  }
}