import { JSONSchemaType } from "ajv";
import { NetworkProductKind } from "../type/NetworkProduct";

export const ProductKindSchema: JSONSchemaType<NetworkProductKind> = {
  required: ["id", "name"],
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    name: {
      maximum: 250,
      type: "string",
    },
    pricePerUnit: {
      exclusiveMinimum: 0,
      type: "number",
      nullable: true,
    },
  },
};
