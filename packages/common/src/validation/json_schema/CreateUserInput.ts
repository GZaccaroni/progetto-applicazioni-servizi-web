import { JSONSchemaType } from "ajv";
import { CreateUserInput } from "../../model/network/CreateUserInput";

export const CreateUserInputSchema: JSONSchemaType<CreateUserInput> = {
  required: ["isAdmin", "password", "username"],
  additionalProperties: false,
  type: "object",
  properties: {
    username: {
      minLength: 8,
      maxLength: 50,
      type: "string",
      transform: ["trim", "toLowerCase"],
      regexp: "/^[a-z0-9_]*$/",
    },
    password: {
      type: "string",
    },
    isAdmin: {
      type: "boolean",
    },
  },
};
