import { JSONSchemaType } from "ajv";
import { UpdateProductInput } from "../type/UpdateProductInput";
import { ProductSchema } from "./Product";

export const UpdateProductInputSchema: JSONSchemaType<UpdateProductInput> =
  ProductSchema;
