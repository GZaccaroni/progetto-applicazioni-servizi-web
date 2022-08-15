import {JSONSchemaType} from "ajv"
import {Customer} from "../type/Customer";

export const CustomerSchema: JSONSchemaType<Customer> = {
  "required": [
    "name"
  ],
  "type": "object",
  "properties": {
    "name": {
      "maximum": 250,
      "type": "string"
    },
    "phoneNumber": {
      "type": "string",
      "nullable": true,
    },
    "address": {
      "type": "string",
      "nullable": true,
    },
    "vatNumber": {
      "type": "string",
      "nullable": true,
    }
  }
}