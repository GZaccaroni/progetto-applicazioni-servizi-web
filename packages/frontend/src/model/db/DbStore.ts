import { DbIdentifiable } from "./DbIdentifiable";

export interface DbStoreAuthorization {
  userId: string;
  username: string;
  accessLevel: string;
}
export interface DbStore extends DbIdentifiable {
  name: string;
  authorizations: Array<DbStoreAuthorization>;
}
