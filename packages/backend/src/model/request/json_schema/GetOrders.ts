import {JSONSchemaType} from "ajv"
import {PaginateParamsSchema} from "./PaginateParams";
import {FilterByDateSchema} from "./FilterByDate";
import {FilterByStoreSchema} from "./FilterByStore";
import {GetOrders} from "../type/GetOrders";

export const GetOrdersSchema: JSONSchemaType<GetOrders> ={
  "type": "object",
  "required": [],
  "allOf": [
    PaginateParamsSchema,
    FilterByDateSchema,
    FilterByStoreSchema
  ]
}