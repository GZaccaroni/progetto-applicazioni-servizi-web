import mongoose from "mongoose";

const Log= new mongoose.Schema({
  username: String,
  action: {
    type: String,
    enum: ["Create","Update","Delete"]
  },
  objectID: String
},{timestamps:true});

export default mongoose.model("log",Log);
