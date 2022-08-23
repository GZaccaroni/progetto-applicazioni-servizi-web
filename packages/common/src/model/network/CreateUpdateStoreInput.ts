import { NetworkStore } from "./NetworkStore";
import { NetworkIdentifiable } from "./NetworkIdentifiable";

export type CreateUpdateStoreInput = Omit<
  NetworkStore,
  keyof NetworkIdentifiable
>;
