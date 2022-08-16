import { CreateStoreInput } from "@/model/network/CreateStoreInput";
import { NetworkIdentifiable } from "@/model/network/NetworkIdentifiable";

export type UpdateStoreInput = CreateStoreInput & NetworkIdentifiable;
