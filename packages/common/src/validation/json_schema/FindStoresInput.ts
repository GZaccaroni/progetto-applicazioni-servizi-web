import { JSONSchemaType } from "ajv";
import { FindStoresInput } from "../../model/network/FindStoresInput";
import { PaginateParamsSchema } from "./PaginateParams";
import { FilterByNameSchema } from "./FilterByName";

export const FindStoresInputSchema: JSONSchemaType<FindStoresInput> = {
  type: "object",
  required: [],
  allOf: [
    PaginateParamsSchema,
    FilterByNameSchema,
    {
      type: "object",
      properties: {
        authorized: {
          type: "boolean",
          nullable: true,
        },
      },
    },
  ],
};
