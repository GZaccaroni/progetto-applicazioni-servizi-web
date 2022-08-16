import { NetworkIdentifiable } from "@/model/network/NetworkIdentifiable";
import { NetworkProduct } from "@/model/network/NetworkProduct";

export type CreateUpdateProductInput = Omit<
  NetworkProduct,
  keyof NetworkIdentifiable
>;
