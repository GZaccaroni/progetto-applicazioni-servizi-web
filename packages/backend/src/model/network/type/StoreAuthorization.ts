import { StoreAccessLevel } from "../../common/StoreAccessLevel";

export interface StoreAuthorization {
  userId: string;
  accessLevel: StoreAccessLevel;
}
