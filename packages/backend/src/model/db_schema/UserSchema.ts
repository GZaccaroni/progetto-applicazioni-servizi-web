import mongoose, {PassportLocalSchema} from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export const User = new mongoose.Schema({
  username: String,
  isAdmin: Boolean
});

User.plugin(passportLocalMongoose);

export default mongoose.model('userData', User as PassportLocalSchema<any, any>, "users");