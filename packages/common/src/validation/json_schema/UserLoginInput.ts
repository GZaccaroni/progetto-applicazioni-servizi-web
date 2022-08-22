import { JSONSchemaType } from "ajv";
import {UserLoginInput} from "../../model/network/UserLoginInput";

export const UserLoginInputSchema: JSONSchemaType<UserLoginInput> = {
  required: ["username", "password"],
  type: "object",
  properties: {
    username: {
      maximum: 50,
      type: "string",
    },
    password: {
      type: "string",
    },
  },
};
