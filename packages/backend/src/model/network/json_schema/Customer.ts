import { JSONSchemaType } from "ajv";
import { NetworkCustomer } from "../type/NetworkCustomer";

export const CustomerSchema: JSONSchemaType<NetworkCustomer> = {
  required: ["name"],
  type: "object",
  properties: {
    name: {
      maximum: 250,
      type: "string",
    },
    phoneNumber: {
      type: "string",
      nullable: true,
    },
    address: {
      type: "string",
      nullable: true,
    },
    vatNumber: {
      type: "string",
      nullable: true,
    },
  },
};
