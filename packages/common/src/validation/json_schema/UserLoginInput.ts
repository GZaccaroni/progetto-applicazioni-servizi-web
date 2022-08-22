import { JSONSchemaType } from "ajv";
import {UserLoginInput} from "../../model/network/UserLoginInput";

export const UserLoginInputSchema: JSONSchemaType<UserLoginInput> = {
  required: ["username", "password"],
  type: "object",
  properties: {
    username: {
      type: "string",
      maxLength: 50,
    },
    password: {
      type: "string",
    },
  },
};
