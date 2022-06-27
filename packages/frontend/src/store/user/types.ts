import { DbUser } from "@/model/db/DbUser";

export interface UserState {
  isLoggedIn: boolean;
  userProfile?: DbUser;
}
