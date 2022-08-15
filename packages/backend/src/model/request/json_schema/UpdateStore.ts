import {JSONSchemaType} from "ajv"
import {StoreSchema} from "./Store";
import {UpdateStore} from "../type/UpdateStore";

export const UpdateStoreSchema: JSONSchemaType<UpdateStore> = StoreSchema