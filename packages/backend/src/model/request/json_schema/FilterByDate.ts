import { JSONSchemaType } from "ajv";
import { FilterByDate } from "../type/FilterByDate";

export const FilterByDateSchema: JSONSchemaType<FilterByDate> = {
  type: "object",
  properties: {
    fromDate: {
      type: "string",
      format: "date-time",
      nullable: true,
    },
    toDate: {
      type: "string",
      format: "date-time",
      nullable: true,
    },
  },
};
