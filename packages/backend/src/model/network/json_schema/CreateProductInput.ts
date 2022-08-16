import { JSONSchemaType } from "ajv";
import { CreateProductInput } from "../type/CreateProductInput";
import { ProductSchema } from "./Product";

export const CreateProductInputSchema: JSONSchemaType<CreateProductInput> =
  ProductSchema;
