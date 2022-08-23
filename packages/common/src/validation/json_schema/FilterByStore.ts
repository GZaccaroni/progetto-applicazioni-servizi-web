import { JSONSchemaType } from "ajv";
import { FilterByStore } from "../../model/network/FilterByStore";

export const FilterByStoreSchema: JSONSchemaType<FilterByStore> = {
  type: "object",
  properties: {
    storeId: {
      type: "string",
      nullable: true,
    },
  },
};
