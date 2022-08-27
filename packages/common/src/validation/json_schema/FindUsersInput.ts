import { JSONSchemaType } from "ajv";
import { FindUsersInput } from "../../model/network/FindUsersInput";
import { PaginateParamsSchema } from "./PaginateParams";
import { FilterByNameSchema } from "./FilterByName";

export const FindUsersInputSchema: JSONSchemaType<FindUsersInput> = {
  type: "object",
  required: [],
  allOf: [PaginateParamsSchema, FilterByNameSchema],
};
