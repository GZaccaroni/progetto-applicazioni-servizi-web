import { NetworkIdentifiable } from "./NetworkIdentifiable";
import {StoreAccessLevel} from "../common/StoreAccessLevel";

export interface NetworkStore extends NetworkIdentifiable {
  name: string;
  authorizations: Array<NetworkStoreAuthorization>;
}
export interface NetworkStoreAuthorization {
  userId: string;
  accessLevel: StoreAccessLevel;
}
