import { JSONSchemaType } from "ajv";
import {UpdateUserInput} from "../../model/network/UpdateUserInput";

export const UpdateUserInputSchema: JSONSchemaType<UpdateUserInput> = {
  type: "object",
  additionalProperties: false,
  properties: {
    password: {
      type: "string",
      format: "password",
      nullable: true,
    },
    isAdmin: {
      type: "boolean",
      nullable: true,
    },
  },
};
