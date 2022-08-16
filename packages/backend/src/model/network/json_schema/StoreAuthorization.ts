import { JSONSchemaType } from "ajv";
import { StoreAuthorization } from "../type/StoreAuthorization";
import { StoreAccessLevel } from "../../common/StoreAccessLevel";

export const StoreAuthorizationSchema: JSONSchemaType<StoreAuthorization> = {
  required: ["accessLevel", "userId"],
  type: "object",
  properties: {
    userId: {
      type: "string",
    },
    accessLevel: {
      type: "string",
      enum: [StoreAccessLevel.Salesman, StoreAccessLevel.Manager],
    },
  },
};
