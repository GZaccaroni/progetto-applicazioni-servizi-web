import { JSONSchemaType } from "ajv";
import { GetUsers } from "../type/GetUsers";
import { PaginateParamsSchema } from "./PaginateParams";
import { FilterByNameSchema } from "./FilterByName";

export const GetUsersSchema: JSONSchemaType<GetUsers> = {
  type: "object",
  required: [],
  allOf: [PaginateParamsSchema, FilterByNameSchema],
};
