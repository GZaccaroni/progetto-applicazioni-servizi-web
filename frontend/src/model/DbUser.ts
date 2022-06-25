import { DbIdentifiable } from "@/model/DbIdentifiable";

export interface DbUser extends DbIdentifiable {
  username: string;
}
