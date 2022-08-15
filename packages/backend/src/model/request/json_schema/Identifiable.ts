import {JSONSchemaType} from "ajv"
import {Identifiable} from "../type/Identifiable";

export const IdentifiableSchema: JSONSchemaType<Identifiable> = {
  "required": [
    "id"
  ],
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    }
  }
}