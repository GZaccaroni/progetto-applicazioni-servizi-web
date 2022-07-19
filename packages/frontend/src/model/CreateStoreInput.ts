import { DbIdentifiable } from "@/model/db/DbIdentifiable";
import { DbStoreAccessLevel } from "@/model/db/DbStore";

export interface CreateStoreInput extends DbIdentifiable {
  name: string;
  authorizations: Array<StoreSetAuthorization>;
}
interface StoreSetAuthorization {
  userId: string;
  accessLevel: DbStoreAccessLevel;
}
