import { StoreAuthorization } from "./StoreAuthorization";

export interface Store {
  name: string;
  authorizations: Array<StoreAuthorization>;
}
