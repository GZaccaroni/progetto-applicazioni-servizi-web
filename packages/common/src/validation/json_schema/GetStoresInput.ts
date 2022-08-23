import { JSONSchemaType } from "ajv";
import { GetStoresInput } from "../../model/network/GetStoresInput";
import { PaginateParamsSchema } from "./PaginateParams";
import { FilterByNameSchema } from "./FilterByName";

export const GetStoresInputSchema: JSONSchemaType<GetStoresInput> = {
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
        },
      },
    },
  ],
};
