import { NetworkIdentifiable } from "./NetworkIdentifiable";

export interface NetworkCustomer extends NetworkIdentifiable {
  name: string;
  address?: string;
  phoneNumber?: string;
  vatNumber?: string;
}
