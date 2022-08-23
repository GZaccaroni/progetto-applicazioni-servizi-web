import { JSONSchemaType } from "ajv";
import { NetworkStoreAuthorization } from "../../model/network/NetworkStore";
import {StoreAccessLevel} from "../../model/common/StoreAccessLevel";

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
