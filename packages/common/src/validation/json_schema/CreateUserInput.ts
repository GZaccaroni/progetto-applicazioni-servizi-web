import { JSONSchemaType } from "ajv";
import { CreateUserInput } from "../../model/network/CreateUserInput";

export const CreateUserInputSchema: JSONSchemaType<CreateUserInput> = {
  required: ["isAdmin", "password", "username"],
  type: "object",
  properties: {
    username: {
      minLength: 1,
      maxLength: 50,
      type: "string",
      regexp: "/^[a-z0-9_]*$/",
      transform: ["trim", "toLowerCase"],
    },
    password: {
      type: "string",
    },
    isAdmin: {
      type: "boolean",
    },
  },
};
