import { JSONSchemaType } from "ajv";
import { CreateUpdateCustomerInput } from "../type/CreateUpdateCustomerInput";

export const CreateUpdateCustomerInputSchema: JSONSchemaType<CreateUpdateCustomerInput> =
  {
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
