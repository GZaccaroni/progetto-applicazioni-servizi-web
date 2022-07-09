import { CreateStoreInput } from "@/model/CreateStoreInput";
import { DbIdentifiable } from "@/model/db/DbIdentifiable";

export type UpdateStoreInput = CreateStoreInput & DbIdentifiable;
