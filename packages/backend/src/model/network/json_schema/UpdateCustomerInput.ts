import { JSONSchemaType } from "ajv";
import { UpdateCustomerInput } from "../type/UpdateCustomerInput";
import { CustomerSchema } from "./Customer";

export const UpdateCustomerInputSchema: JSONSchemaType<UpdateCustomerInput> =
  CustomerSchema;
