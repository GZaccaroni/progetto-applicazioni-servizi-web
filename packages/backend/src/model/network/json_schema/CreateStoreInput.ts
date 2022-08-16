import { JSONSchemaType } from "ajv";
import { CreateStoreInput } from "../type/CreateStoreInput";
import { StoreSchema } from "./Store";

export const CreateStoreInputSchema: JSONSchemaType<CreateStoreInput> =
  StoreSchema;
