import {JSONSchemaType} from "ajv"
import {CreateOrderSchema} from "./CreateOrder";
import {UpdateOrder} from "../type/UpdateOrder";

export const UpdateOrderSchema: JSONSchemaType<UpdateOrder> = CreateOrderSchema