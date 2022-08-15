import { JSONSchemaType } from "ajv";
import { GetProducts } from "../type/GetProducts";
import { PaginateParamsSchema } from "./PaginateParams";
import { FilterByNameSchema } from "./FilterByName";

export const GetProductsSchema: JSONSchemaType<GetProducts> = {
  type: "object",
  required: [],
  allOf: [PaginateParamsSchema, FilterByNameSchema],
};
