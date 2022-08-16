import mongoose, {
  PassportLocalDocument,
  PassportLocalModel,
  Types,
} from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";

export type UserDocument = {
  _id: Types.ObjectId;
  username: string;
  isAdmin: boolean;
} & Omit<PassportLocalDocument, "_id">;

const UserSchema = new mongoose.Schema<UserDocument>({
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
export const UserProjection = { _id: 0, id: "$_id", username: 1, isAdmin: 1 };
