import { JSONSchemaType } from "ajv";
import { User } from "../type/User";

export const UserSchema: JSONSchemaType<User> = {
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
