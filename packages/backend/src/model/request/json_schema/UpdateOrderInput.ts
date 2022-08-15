import { JSONSchemaType } from "ajv";
import { CreateOrderInputSchema } from "./CreateOrderInput";
import { UpdateOrderInput } from "../type/UpdateOrderInput";

export const UpdateOrderInputSchema: JSONSchemaType<UpdateOrderInput> =
  CreateOrderInputSchema;
