import { StoreAccessLevel } from "../../common/StoreAccessLevel";

export interface NetworkStore {
  name: string;
  authorizations: Array<NetworkStoreAuthorization>;
}
export interface NetworkStoreAuthorization {
  userId: string;
  accessLevel: StoreAccessLevel;
}
