import { NetworkCustomer } from "@/model/network/NetworkCustomer";
import { NetworkIdentifiable } from "@/model/network/NetworkIdentifiable";

export type CreateUpdateCustomerInput = Omit<
  NetworkCustomer,
  keyof NetworkIdentifiable
>;
