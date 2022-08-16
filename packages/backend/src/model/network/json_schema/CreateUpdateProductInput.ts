import { JSONSchemaType } from "ajv";
import { CreateUpdateProductInput } from "../type/CreateUpdateProductInput";
import { ProductSchema } from "./Product";

export const CreateUpdateProductInputSchema: JSONSchemaType<CreateUpdateProductInput> =
  ProductSchema;
