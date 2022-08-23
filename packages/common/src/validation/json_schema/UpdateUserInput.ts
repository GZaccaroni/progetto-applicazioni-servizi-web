import { JSONSchemaType } from "ajv";
import {UpdateUserInput} from "../../model/network/UpdateUserInput";

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
