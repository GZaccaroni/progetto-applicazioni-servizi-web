import {JSONSchemaType} from "ajv"
import {PaginateParams} from "../type/PaginateParams";

export const PaginateParamsSchema: JSONSchemaType<PaginateParams> = {
  "required": [
    "limit"
  ],
  "type": "object",
  "properties": {
    "limit": {
      "exclusiveMinimum": 0,
      "maximum": 100,
      "type": "number"
    },
    "pagingNext": {
      "type": "string",
      "nullable": true,
    },
    "pagingPrevious": {
      "type": "string",
      "nullable": true,
    }
  }
}