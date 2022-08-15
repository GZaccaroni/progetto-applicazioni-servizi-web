import { JSONSchemaType } from "ajv";
import { UserLoginInput } from "../type/UserLoginInput";

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
