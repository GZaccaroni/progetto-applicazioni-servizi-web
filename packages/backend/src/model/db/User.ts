import mongoose, {
  ObjectId,
  PassportLocalDocument,
  PassportLocalModel,
  ProjectionType,
  Schema,
} from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { mongoosePagination, Pagination } from "@/plugins/mongoose-paginate";

export type UserDocument = {
  _id: ObjectId;
  username: string;
  isAdmin: boolean;
} & Omit<PassportLocalDocument, "_id">;

const UserSchema = new mongoose.Schema<UserDocument>({
  _id: {
    type: Schema.Types.ObjectId,
  },
  username: {
    type: String,
    unique: true,
  },
  isAdmin: Boolean,
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(mongoosePagination);

export default mongoose.model<
  UserDocument,
  Pagination<UserDocument> & PassportLocalModel<UserDocument>
>("user", UserSchema, "users");
export const UserProjection: ProjectionType<UserDocument> = {
  _id: 0,
  id: "$_id",
  username: 1,
  isAdmin: 1,
};
