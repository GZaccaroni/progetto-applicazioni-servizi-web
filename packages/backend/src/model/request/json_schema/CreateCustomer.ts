import {JSONSchemaType} from "ajv"
import {CreateCustomer} from "../type/CreateCustomer";
import {CustomerSchema} from "./Customer";

export const CreateCustomerSchema: JSONSchemaType<CreateCustomer> = CustomerSchema