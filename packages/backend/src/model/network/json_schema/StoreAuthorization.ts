import { JSONSchemaType } from "ajv";
import { StoreAccessLevel } from "../../common/StoreAccessLevel";
import { NetworkStoreAuthorization } from "../type/NetworkStore";

export const StoreAuthorizationSchema: JSONSchemaType<NetworkStoreAuthorization> =
  {
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
