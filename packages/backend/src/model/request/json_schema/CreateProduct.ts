import { JSONSchemaType } from "ajv";
import { CreateProduct } from "../type/CreateProduct";
import { ProductSchema } from "./Product";

export const CreateProductSchema: JSONSchemaType<CreateProduct> = ProductSchema;
