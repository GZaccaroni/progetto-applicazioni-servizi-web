import mongoose from "mongoose";
import {mongoosePagination, Pagination} from "mongoose-paginate-ts";

type StoreDocument = mongoose.Document & {
  name: string,
  authorizations: [{
    userId: string,
    accessLevel: string
  }]
};

const StoreSchema = new mongoose.Schema({
  name: String,
  authorizations: [{
    userId: String,
    accessLevel: String
  }]
});

StoreSchema.plugin(mongoosePagination);

export default mongoose.model<StoreDocument, Pagination<StoreDocument>>('store', StoreSchema, 'stores');