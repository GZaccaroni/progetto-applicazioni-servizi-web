import { DbIdentifiable } from "./DbIdentifiable";

export enum DbStoreAccessLevel {
  Salesman = "salesman",
  Manager = "manager",
}
export interface DbStoreAuthorization {
  userId: string;
  accessLevel: DbStoreAccessLevel;
}
export interface DbStore extends DbIdentifiable {
  name: string;
  authorizations: Array<DbStoreAuthorization>;
}
