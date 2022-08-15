import { JSONSchemaType } from "ajv";
import { AccessLevel, StoreAuthorization } from "../type/StoreAuthorization";

export const StoreAuthorizationSchema: JSONSchemaType<StoreAuthorization> = {
  required: ["accessLevel", "userId"],
  type: "object",
  properties: {
    userId: {
      type: "string",
    },
    accessLevel: {
      type: "string",
      enum: [AccessLevel.Salesman, AccessLevel.Manager],
    },
  },
};
