import { JSONSchemaType } from "ajv";
import { FilterByProducts } from "../type/FilterByProducts";

export const FilterByProductsSchema: JSONSchemaType<FilterByProducts> = {
  type: "object",
  required: [],
  properties: {
    products: {
      type: "array",
      nullable: true,
      items: {
        type: "object",
        required: ["productId"],
        properties: {
          productId: {
            type: "string",
          },
          variantId: {
            type: "string",
            nullable: true,
          },
        },
      },
      minItems: 0,
    },
  },
};
