import { JSONSchemaType } from "ajv";
import { CreateUserInput } from "../type/CreateUserInput";

export const CreateUserInputSchema: JSONSchemaType<CreateUserInput> = {
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
