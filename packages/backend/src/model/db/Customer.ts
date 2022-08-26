import mongoose, { ProjectionType, Types } from "mongoose";
import { mongoosePagination, Pagination } from "@/plugins/mongoose-paginate";

export type CustomerDocument = {
  _id: Types.ObjectId;
  name: string;
  phoneNumber?: string;
  address?: string;
  vatNumber?: string;
};

const CustomerSchema = new mongoose.Schema<CustomerDocument>({
  name: {
    type: String,
    unique: true,
  },
  phoneNumber: String,
  address: String,
  vatNumber: String,
});

CustomerSchema.plugin(mongoosePagination);

export default mongoose.model<CustomerDocument, Pagination<CustomerDocument>>(
  "customer",
  CustomerSchema,
  "customers"
);

export const CustomerProjection: ProjectionType<CustomerDocument> = {
  _id: 0,
  id: "$_id",
  name: 1,
  phoneNumber: 1,
  address: 1,
  vatNumber: 1,
};
