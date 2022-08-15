import { JSONSchemaType } from "ajv";
import { GetCustomers } from "../type/GetCustomers";
import { PaginateParamsSchema } from "./PaginateParams";
import { FilterByNameSchema } from "./FilterByName";

export const GetCustomersSchema: JSONSchemaType<GetCustomers> = {
  type: "object",
  required: [],
  allOf: [PaginateParamsSchema, FilterByNameSchema],
};
