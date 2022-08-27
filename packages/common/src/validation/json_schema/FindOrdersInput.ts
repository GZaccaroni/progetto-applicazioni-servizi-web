import { JSONSchemaType } from "ajv";
import { PaginateParamsSchema } from "./PaginateParams";
import { FilterByDateSchema } from "./FilterByDate";
import { FilterByStoreSchema } from "./FilterByStore";
import { FindOrdersInput } from "../../model/network/FindOrdersInput";

export const FindOrdersInputSchema: JSONSchemaType<FindOrdersInput> = {
  type: "object",
  required: [],
  allOf: [PaginateParamsSchema, FilterByDateSchema, FilterByStoreSchema],
};
