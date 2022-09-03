import mongoose, { Model, Schema } from "mongoose";

export type CustomSettingDocument = {
  _id: string;
  value: boolean;
};

const CustomSettingSchema = new mongoose.Schema<CustomSettingDocument>({
  _id: Schema.Types.String,
  value: Schema.Types.Boolean,
});

export default mongoose.model<
  CustomSettingDocument,
  Model<CustomSettingDocument>
>("custom_setting", CustomSettingSchema, "custom_settings");
