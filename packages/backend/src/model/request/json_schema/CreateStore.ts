import { JSONSchemaType } from "ajv";
import { CreateStore } from "../type/CreateStore";
import { StoreSchema } from "./Store";

export const CreateStoreSchema: JSONSchemaType<CreateStore> = StoreSchema;
