import mongoose, {InferSchemaType, IPaginateModel} from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import MongoPaging from "mongo-cursor-pagination";

const User = new mongoose.Schema({
  username: String,
  isAdmin: Boolean
});

User.plugin(passportLocalMongoose);
User.plugin(MongoPaging.mongoosePlugin);

type UserSchema= InferSchemaType<typeof User>;

export default mongoose.model<UserSchema>('user', User);