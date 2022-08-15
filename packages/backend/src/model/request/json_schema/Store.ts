import { JSONSchemaType } from "ajv";
import { Store } from "../type/Store";
import { StoreAuthorizationSchema } from "./StoreAuthorization";

export const StoreSchema: JSONSchemaType<Store> = {
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
