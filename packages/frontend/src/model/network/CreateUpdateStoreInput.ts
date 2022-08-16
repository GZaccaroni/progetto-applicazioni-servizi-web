import { NetworkIdentifiable } from "@/model/network/NetworkIdentifiable";
import { StoreAccessLevel } from "@/model/common/StoreAccessLevel";

export interface CreateUpdateStoreInput {
  name: string;
  authorizations: Array<StoreSetAuthorization>;
}
interface StoreSetAuthorization {
  userId: string;
  accessLevel: StoreAccessLevel;
}
