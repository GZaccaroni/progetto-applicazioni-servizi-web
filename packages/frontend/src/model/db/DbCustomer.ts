import { DbIdentifiable } from "./DbIdentifiable";

export interface DbCustomer extends DbIdentifiable {
  name: string;
  address?: string;
  phoneNumber?: string;
  vatNumber?: string;
}
