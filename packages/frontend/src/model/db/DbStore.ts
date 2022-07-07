import { DbIdentifiable } from "./DbIdentifiable";

export enum DbStoreAccessLevel {
  salesman = "salesman",
  manager = "manager",
}
export interface DbStoreAuthorization {
  userId: string;
  username: string;
  accessLevel: DbStoreAccessLevel;
}
export interface DbStore extends DbIdentifiable {
  name: string;
  authorizations: Array<DbStoreAuthorization>;
}
