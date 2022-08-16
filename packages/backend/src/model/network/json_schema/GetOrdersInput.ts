import { JSONSchemaType } from "ajv";
import { PaginateParamsSchema } from "./PaginateParams";
import { FilterByDateSchema } from "./FilterByDate";
import { FilterByStoreSchema } from "./FilterByStore";
import { GetOrdersInput } from "../type/GetOrdersInput";

export const GetOrdersInputSchema: JSONSchemaType<GetOrdersInput> = {
  type: "object",
  required: [],
  allOf: [PaginateParamsSchema, FilterByDateSchema, FilterByStoreSchema],
};
