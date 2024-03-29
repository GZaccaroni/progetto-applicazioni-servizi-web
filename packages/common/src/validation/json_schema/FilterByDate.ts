import { JSONSchemaType } from "ajv";
import { FilterByDate } from "../../model/network/FilterByDate";

export const FilterByDateSchema: JSONSchemaType<FilterByDate> = {
  type: "object",
  properties: {
    fromDate: {
      type: "string",
      format: "date",
      nullable: true,
    },
    toDate: {
      type: "string",
      format: "date",
      nullable: true,
    },
  },
};
