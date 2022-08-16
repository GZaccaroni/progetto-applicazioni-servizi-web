import mongoose from "mongoose";

const Log = new mongoose.Schema(
  {
    username: String,
    action: {
      type: String,
      enum: ["Create", "Update", "Delete"],
    },
    object: {
      id: String,
      type: {
        type: String,
        enum: ["User", "Product", "Customer", "Order", "Store"],
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("log", Log);
