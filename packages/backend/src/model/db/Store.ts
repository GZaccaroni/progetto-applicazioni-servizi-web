import mongoose, { ObjectId, ProjectionType } from "mongoose";
import { mongoosePagination, Pagination } from "@/plugins/mongoose-paginate";
import { StoreAccessLevel } from "../common/StoreAccessLevel";

export type StoreDocument = {
  _id: ObjectId;
  name: string;
  authorizations: Array<StoreDocumentAuthorization>;
};
export interface StoreDocumentAuthorization {
  userId: string;
  accessLevel: StoreAccessLevel;
}

const StoreSchema = new mongoose.Schema<StoreDocument>({
  name: {
    type: String,
    unique: true,
  },
  authorizations: [
    {
      userId: String,
      accessLevel: {
        type: String,
        enum: [StoreAccessLevel.Salesman, StoreAccessLevel.Manager],
      },
    },
  ],
});

StoreSchema.plugin(mongoosePagination);

export default mongoose.model<StoreDocument, Pagination<StoreDocument>>(
  "store",
  StoreSchema,
  "stores"
);

export const StoreProjection: ProjectionType<StoreDocument> = {
  _id: 0,
  id: "$_id",
  name: 1,
  authorizations: {
    userId: 1,
    accessLevel: 1,
  },
};
