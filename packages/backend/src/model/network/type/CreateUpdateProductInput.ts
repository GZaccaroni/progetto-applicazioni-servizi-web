import { NetworkProduct } from "./NetworkProduct";
import { NetworkIdentifiable } from "./NetworkIdentifiable";

export type CreateUpdateProductInput = Omit<
  NetworkProduct,
  keyof NetworkIdentifiable
>;
