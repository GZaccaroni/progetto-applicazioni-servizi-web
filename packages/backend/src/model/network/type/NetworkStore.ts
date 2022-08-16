import { StoreAuthorization } from "./StoreAuthorization";

export interface NetworkStore {
  name: string;
  authorizations: Array<StoreAuthorization>;
}
