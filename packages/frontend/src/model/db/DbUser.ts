import { DbIdentifiable } from "./DbIdentifiable";

export interface DbUser extends DbIdentifiable {
  username: string;
  isAdmin: boolean;
}
