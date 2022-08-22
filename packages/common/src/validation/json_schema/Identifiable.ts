import { JSONSchemaType } from "ajv";
import { NetworkIdentifiable } from "../../model/network/NetworkIdentifiable";

export const IdentifiableSchema: JSONSchemaType<NetworkIdentifiable> = {
  required: ["id"],
  type: "object",
  properties: {
    id: {
      type: "string",
    },
  },
};
