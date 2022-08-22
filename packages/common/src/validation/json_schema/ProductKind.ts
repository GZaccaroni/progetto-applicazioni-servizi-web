import { JSONSchemaType } from "ajv";
import { NetworkProductKind } from "../../model/network/NetworkProduct";

export const ProductKindSchema: JSONSchemaType<NetworkProductKind> = {
  required: ["id", "name"],
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    name: {
      minLength: 1,
      maxLength: 250,
      type: "string",
      transform: ["trim"],
    },
    pricePerUnit: {
      exclusiveMinimum: 0,
      type: "number",
      nullable: true,
    },
  },
};
