import {JSONSchemaType} from "ajv"
import {ProductKind} from "../type/ProductKind";

export const ProductKindSchema: JSONSchemaType<ProductKind> = {
  "required": [
    "id", "name", "fullName"
  ],
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "name": {
      "maximum": 250,
      "type": "string"
    },
    "fullName": {
      "maximum": 500,
      "type": "string"
    },
    "pricePerUnit": {
      "exclusiveMinimum": 0,
      "type": "number",
      "nullable": true
    }
  }
}