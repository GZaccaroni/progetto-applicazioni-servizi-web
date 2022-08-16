import { JSONSchemaType } from "ajv";
import { CreateUpdateStoreInput } from "../type/CreateUpdateStoreInput";
import { StoreSchema } from "./Store";

export const CreateUpdateStoreInputSchema: JSONSchemaType<CreateUpdateStoreInput> =
  StoreSchema;
