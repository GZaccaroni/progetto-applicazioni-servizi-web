import { JSONSchemaType } from "ajv";
import { FilterByName } from "../../model/network/FilterByName";

export const FilterByNameSchema: JSONSchemaType<FilterByName> = {
  type: "object",
  properties: {
    searchName: {
      type: "string",
      nullable: true,
    },
  },
};
