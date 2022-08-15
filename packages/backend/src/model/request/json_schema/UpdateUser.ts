import { JSONSchemaType } from "ajv";
import { UpdateUser } from "../type/UpdateUser";

export const UpdateUserSchema: JSONSchemaType<UpdateUser> = {
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
