import mongoose, {PassportLocalModel} from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import {mongoosePagination, Pagination} from "mongoose-paginate-ts";

type UserDocument = mongoose.Document & {
  username: string,
  isAdmin: boolean
};

const UserSchema = new mongoose.Schema({
  username: String,
  isAdmin: Boolean
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(mongoosePagination);

export default mongoose.model<UserDocument, Pagination<UserDocument> & PassportLocalModel<UserDocument>>('user', UserSchema, 'users');