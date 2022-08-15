import {JSONSchemaType} from "ajv"
import {StoreAuthorization} from "../type/StoreAuthorization";

export const StoreAuthorizationSchema: JSONSchemaType<StoreAuthorization> = {
  "required": [
    "accessLevel",
    "userId"
  ],
  "type": "object",
  "properties": {
    "userId": {
      "type": "string"
    },
    "accessLevel": {
      "type": "string",
      "enum": [
        "salesman",
        "manager"
      ]
    }
  }
}