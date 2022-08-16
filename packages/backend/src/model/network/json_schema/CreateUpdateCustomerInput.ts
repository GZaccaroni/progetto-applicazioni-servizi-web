import { JSONSchemaType } from "ajv";
import { CreateUpdateCustomerInput } from "../type/CreateUpdateCustomerInput";
import { CustomerSchema } from "./Customer";

export const CreateUpdateCustomerInputSchema: JSONSchemaType<CreateUpdateCustomerInput> =
  CustomerSchema;
