import { JSONSchemaType } from "ajv";
import {UserLoginInput} from "../../model/network/UserLoginInput";

export const UserLoginInputSchema: JSONSchemaType<UserLoginInput> = {
  required: ["username", "password"],
  type: "object",
  properties: {
    username: {
      type: "string",
      minLength: 8,
      maxLength: 50,
      regexp: "/^[a-z0-9_]*$/",
      transform: ["trim", "toLowerCase"],
    },
    password: {
      type: "string",
    },
  },
};
