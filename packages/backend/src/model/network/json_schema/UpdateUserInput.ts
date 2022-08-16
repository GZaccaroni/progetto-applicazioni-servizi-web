import { JSONSchemaType } from "ajv";
import { UpdateUserInput } from "../type/UpdateUserInput";

export const UpdateUserInputSchema: JSONSchemaType<UpdateUserInput> = {
  type: "object",
  properties: {
    password: {
      type: "string",
      nullable: true,
    },
    isAdmin: {
      type: "boolean",
      nullable: true,
    },
  },
};
