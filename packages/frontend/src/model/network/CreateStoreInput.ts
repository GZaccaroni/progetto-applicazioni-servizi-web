import { NetworkIdentifiable } from "@/model/network/NetworkIdentifiable";
import { StoreAccessLevel } from "@/model/common/StoreAccessLevel";

export interface CreateStoreInput extends NetworkIdentifiable {
  name: string;
  authorizations: Array<StoreSetAuthorization>;
}
interface StoreSetAuthorization {
  userId: string;
  accessLevel: StoreAccessLevel;
}
