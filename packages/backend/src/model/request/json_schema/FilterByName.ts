import { JSONSchemaType } from "ajv";
import { FilterByName } from "../type/FilterByName";

export const FilterByNameSchema: JSONSchemaType<FilterByName> = {
  type: "object",
  properties: {
    searchName: {
      type: "string",
      nullable: true,
    },
  },
};
