import { JSONSchemaType } from "ajv";
import { GetUsersInput } from "../type/GetUsersInput";
import { PaginateParamsSchema } from "./PaginateParams";
import { FilterByNameSchema } from "./FilterByName";

export const GetUsersInputSchema: JSONSchemaType<GetUsersInput> = {
  type: "object",
  required: [],
  allOf: [PaginateParamsSchema, FilterByNameSchema],
};
