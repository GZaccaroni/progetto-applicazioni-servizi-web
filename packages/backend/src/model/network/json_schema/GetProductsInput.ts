import { JSONSchemaType } from "ajv";
import { GetProductsInput } from "../type/GetProductsInput";
import { PaginateParamsSchema } from "./PaginateParams";
import { FilterByNameSchema } from "./FilterByName";

export const GetProductsInputSchema: JSONSchemaType<GetProductsInput> = {
  type: "object",
  required: [],
  allOf: [PaginateParamsSchema, FilterByNameSchema],
};
