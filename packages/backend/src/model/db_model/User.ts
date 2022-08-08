import mongoose, {PassportLocalDocument, PassportLocalModel} from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import {mongoosePagination, Pagination} from "mongoose-paginate-ts";

type UserDocument = PassportLocalDocument & {
  username: string,
  isAdmin: boolean
};

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  isAdmin: Boolean
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(mongoosePagination);

export default mongoose.model<UserDocument, Pagination<UserDocument> & PassportLocalModel<UserDocument>>('user', UserSchema, 'users');
export const UserProjection= { _id: 0,
  id: '$_id',
  username: 1,
  isAdmin: 1
}
