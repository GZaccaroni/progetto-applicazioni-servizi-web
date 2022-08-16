import { JSONSchemaType } from "ajv";
import { NetworkProduct } from "../type/NetworkProduct";
import { ProductKindSchema } from "./ProductKind";
import { QuantityUnitOfMeasure } from "../../common/QuantityUnitOfMeasure";

export const ProductSchema: JSONSchemaType<NetworkProduct> = {
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
      enum: [QuantityUnitOfMeasure.Kilogram, QuantityUnitOfMeasure.Piece],
    },
  },
};
