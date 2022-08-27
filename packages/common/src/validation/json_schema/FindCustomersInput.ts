import { JSONSchemaType } from "ajv";
import { FindCustomersInput } from "../../model/network/FindCustomersInput";
import { PaginateParamsSchema } from "./PaginateParams";
import { FilterByNameSchema } from "./FilterByName";

export const FindCustomersInputSchema: JSONSchemaType<FindCustomersInput> = {
  type: "object",
  required: [],
  allOf: [PaginateParamsSchema, FilterByNameSchema],
};
