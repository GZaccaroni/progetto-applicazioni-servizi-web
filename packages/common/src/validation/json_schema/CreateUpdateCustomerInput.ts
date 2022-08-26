import { JSONSchemaType } from "ajv";
import {CreateUpdateCustomerInput} from "../../model/network/CreateUpdateCustomerInput";

export const CreateUpdateCustomerInputSchema: JSONSchemaType<CreateUpdateCustomerInput> =
  {
    required: ["name"],
    type: "object",
    additionalProperties: false,
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
        regexp: "/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$/"
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
