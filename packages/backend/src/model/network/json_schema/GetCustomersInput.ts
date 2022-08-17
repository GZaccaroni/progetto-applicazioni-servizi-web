import { JSONSchemaType } from "ajv";
import { GetCustomersInput } from "../type/GetCustomersInput";
import { PaginateParamsSchema } from "./PaginateParams";
import { FilterByNameSchema } from "./FilterByName";

export const GetCustomersInputSchema: JSONSchemaType<GetCustomersInput> = {
  type: "object",
  required: [],
  allOf: [PaginateParamsSchema, FilterByNameSchema],
};
