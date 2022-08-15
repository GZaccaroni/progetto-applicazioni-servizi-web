import {JSONSchemaType} from "ajv"
import {GetStores} from "../type/GetStores";
import {PaginateParamsSchema} from "./PaginateParams";
import {FilterByNameSchema} from "./FilterByName";

export const GetStoresSchema: JSONSchemaType<GetStores> = {
  "type": "object",
  "required": [],
  "allOf": [
    PaginateParamsSchema,
    FilterByNameSchema,
    {
      "type": "object",
      "properties": {
        "authorized": {
          "type": "boolean"
        }
      }
    }
  ]
}