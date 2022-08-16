import { JSONSchemaType } from "ajv";
import { NetworkIdentifiable } from "../type/NetworkIdentifiable";

export const IdentifiableSchema: JSONSchemaType<NetworkIdentifiable> = {
  required: ["id"],
  type: "object",
  properties: {
    id: {
      type: "string",
    },
  },
};
