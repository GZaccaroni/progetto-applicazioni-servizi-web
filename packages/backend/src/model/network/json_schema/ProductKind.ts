import { JSONSchemaType } from "ajv";
import { NetworkProductKind } from "../type/NetworkProductKind";

export const ProductKindSchema: JSONSchemaType<NetworkProductKind> = {
  required: ["id", "name", "fullName"],
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
    fullName: {
      maximum: 500,
      type: "string",
    },
    pricePerUnit: {
      exclusiveMinimum: 0,
      type: "number",
      nullable: true,
    },
  },
};
