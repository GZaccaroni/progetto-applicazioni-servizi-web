import mongoose from "mongoose";
import {mongoosePagination, Pagination} from "mongoose-paginate-ts";
import {Store} from "../request/type/Store";

type StoreDocument = mongoose.Document & Store;
const StoreSchema = new mongoose.Schema({
  name: String,
  authorizations: [{
    userId: String,
    accessLevel: String
  }]
});

StoreSchema.plugin(mongoosePagination);

export default mongoose.model<StoreDocument, Pagination<StoreDocument>>('store', StoreSchema, 'stores');