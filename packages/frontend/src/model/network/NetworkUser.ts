import { NetworkIdentifiable } from "./NetworkIdentifiable";

export interface NetworkUser extends NetworkIdentifiable {
  username: string;
  isAdmin: boolean;
}
