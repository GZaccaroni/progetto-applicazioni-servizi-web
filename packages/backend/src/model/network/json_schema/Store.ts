import { JSONSchemaType } from "ajv";
import { NetworkStore } from "../type/NetworkStore";
import { StoreAuthorizationSchema } from "./StoreAuthorization";

export const StoreSchema: JSONSchemaType<NetworkStore> = {
  required: ["authorizations", "name"],
  type: "object",
  properties: {
    name: {
      maximum: 250,
      type: "string",
    },
    authorizations: {
      type: "array",
      items: StoreAuthorizationSchema,
    },
  },
};
