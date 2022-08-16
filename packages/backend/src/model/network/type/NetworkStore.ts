import { StoreAccessLevel } from "../../common/StoreAccessLevel";
import { NetworkIdentifiable } from "./NetworkIdentifiable";

export interface NetworkStore extends NetworkIdentifiable {
  name: string;
  authorizations: Array<NetworkStoreAuthorization>;
}
export interface NetworkStoreAuthorization {
  userId: string;
  accessLevel: StoreAccessLevel;
}
