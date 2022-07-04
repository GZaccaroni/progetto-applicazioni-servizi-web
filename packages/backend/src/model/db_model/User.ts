import mongoose, {InferSchemaType, PassportLocalModel, PassportLocalSchema} from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import {mongoosePagination, Pagination} from "mongoose-paginate-ts";

type UserD = mongoose.Document & {
  username: string,
  isAdmin: boolean
};

const User = new mongoose.Schema({
  username: String,
  isAdmin: Boolean
});

User.plugin(passportLocalMongoose);
User.plugin(mongoosePagination);

type UserSchema= InferSchemaType<typeof User>

export default mongoose.model<UserD, Pagination<UserD> & PassportLocalModel<UserD>>('user', User);