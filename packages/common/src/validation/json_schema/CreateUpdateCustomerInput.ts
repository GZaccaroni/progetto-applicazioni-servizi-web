import { JSONSchemaType } from "ajv";
import {CreateUpdateCustomerInput} from "../../model/network/CreateUpdateCustomerInput";

export const CreateUpdateCustomerInputSchema: JSONSchemaType<CreateUpdateCustomerInput> =
  {
    required: ["name"],
    type: "object",
    properties: {
      name: {
        minLength: 3,
        maxLength: 250,
        type: "string",
        transform: ["trim"],
      },
      phoneNumber: {
        type: "string",
        maxLength: 30,
        nullable: true,
        transform: ["trim"],
      },
      address: {
        type: "string",
        maxLength: 250,
        nullable: true,
        transform: ["trim"],
      },
      vatNumber: {
        type: "string",
        maxLength: 50,
        nullable: true,
        transform: ["trim"],
      },
    },
  };
