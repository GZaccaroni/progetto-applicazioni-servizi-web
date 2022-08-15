import { JSONSchemaType } from "ajv";
import { UpdateCustomer } from "../type/UpdateCustomer";
import { CustomerSchema } from "./Customer";

export const UpdateCustomerSchema: JSONSchemaType<UpdateCustomer> =
  CustomerSchema;
