import { JSONSchemaType } from "ajv";
import { StoreSchema } from "./Store";
import { UpdateStoreInput } from "../type/UpdateStoreInput";

export const UpdateStoreInputSchema: JSONSchemaType<UpdateStoreInput> =
  StoreSchema;
