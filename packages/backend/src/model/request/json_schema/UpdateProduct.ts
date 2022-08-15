import { JSONSchemaType } from "ajv";
import { UpdateProduct } from "../type/UpdateProduct";
import { ProductSchema } from "./Product";

export const UpdateProductSchema: JSONSchemaType<UpdateProduct> = ProductSchema;
