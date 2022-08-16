import { JSONSchemaType } from "ajv";
import { CreateCustomerInput } from "../type/CreateCustomerInput";
import { CustomerSchema } from "./Customer";

export const CreateCustomerInputSchema: JSONSchemaType<CreateCustomerInput> =
  CustomerSchema;
