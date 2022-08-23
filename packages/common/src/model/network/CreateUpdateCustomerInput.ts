import { NetworkCustomer } from "./NetworkCustomer";
import { NetworkIdentifiable } from "./NetworkIdentifiable";

export type CreateUpdateCustomerInput = Omit<
  NetworkCustomer,
  keyof NetworkIdentifiable
>;
