import { JSONSchemaType } from "ajv";
import { FindProductsInput } from "../../model/network/FindProductsInput";
import { PaginateParamsSchema } from "./PaginateParams";
import { FilterByNameSchema } from "./FilterByName";

export const FindProductsInputSchema: JSONSchemaType<FindProductsInput> = {
  type: "object",
  required: [],
  allOf: [PaginateParamsSchema, FilterByNameSchema],
};
