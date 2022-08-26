import mongoose, { ObjectId, Schema } from "mongoose";

export type LogDocument = {
  username: string;
  action: "create" | "update" | "delete";
  object: {
    id: ObjectId;
    type: "user" | "product" | "customer" | "order" | "store";
  };
};
const LogSchema = new mongoose.Schema<LogDocument>(
  {
    username: String,
    action: {
      type: String,
      enum: ["create", "update", "delete"],
    },
    object: {
      id: Schema.Types.ObjectId,
      type: {
        type: String,
        enum: ["user", "product", "customer", "order", "store"],
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<LogDocument>("log", LogSchema, "logs");
