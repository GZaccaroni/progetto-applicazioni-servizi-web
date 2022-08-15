import { JSONSchemaType } from "ajv";
import { Product } from "../type/Product";
import { ProductKindSchema } from "./ProductKind";

export const ProductSchema: JSONSchemaType<Product> = {
  required: ["kinds", "name", "unitOfMeasure"],
  type: "object",
  properties: {
    name: {
      maximum: 250,
      type: "string",
    },
    pricePerUnit: {
      exclusiveMinimum: 0,
      type: "number",
      nullable: true,
    },
    kinds: {
      type: "array",
      items: ProductKindSchema,
    },
    unitOfMeasure: {
      type: "string",
      enum: ["kilogram", "piece"],
    },
  },
};
