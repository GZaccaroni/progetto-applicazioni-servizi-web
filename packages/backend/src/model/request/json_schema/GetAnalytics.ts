import { JSONSchemaType } from "ajv";
import { GetAnalytics } from "../type/GetAnalytics";
import { FilterByProductsSchema } from "./FilterByProducts";
import { FilterByDateSchema } from "./FilterByDate";
import { FilterByStoreSchema } from "./FilterByStore";
import { FilterByCustomerSchema } from "./FilterByCustomer";

export const GetAnalyticsSchema: JSONSchemaType<GetAnalytics> = {
  type: "object",
  required: [],
  allOf: [
    FilterByProductsSchema,
    FilterByDateSchema,
    FilterByStoreSchema,
    FilterByCustomerSchema,
    {
      type: "object",
      properties: {
        dataType: {
          type: "string",
          enum: ["quantity", "price"],
        },
      },
    },
  ],
};
