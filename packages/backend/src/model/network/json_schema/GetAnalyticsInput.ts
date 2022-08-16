import { JSONSchemaType } from "ajv";
import { GetAnalyticsInput } from "../type/GetAnalyticsInput";
import { FilterByProductsSchema } from "./FilterByProducts";
import { FilterByDateSchema } from "./FilterByDate";
import { FilterByStoreSchema } from "./FilterByStore";
import { FilterByCustomerSchema } from "./FilterByCustomer";
import { ChartDataType } from "../../common/ChartDataType";

export const GetAnalyticsInputSchema: JSONSchemaType<GetAnalyticsInput> = {
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
          enum: [ChartDataType.Quantity, ChartDataType.Price],
        },
      },
    },
  ],
};
