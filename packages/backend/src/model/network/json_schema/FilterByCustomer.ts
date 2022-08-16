import { JSONSchemaType } from "ajv";
import { FilterByCustomer } from "../type/FilterByCustomer";

export const FilterByCustomerSchema: JSONSchemaType<FilterByCustomer> = {
  type: "object",
  properties: {
    customerId: {
      type: "string",
      nullable: true,
    },
  },
};
