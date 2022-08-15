import { JSONSchemaType } from "ajv";
import { CreateUser } from "../type/CreateUser";

export const CreateUserSchema: JSONSchemaType<CreateUser> = {
  required: ["isAdmin", "password", "username"],
  type: "object",
  properties: {
    username: {
      maximum: 50,
      type: "string",
    },
    password: {
      type: "string",
    },
    isAdmin: {
      type: "boolean",
    },
  },
};
