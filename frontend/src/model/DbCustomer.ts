import { DbIdentifiable } from "@/model/DbIdentifiable";

export interface DbCustomer extends DbIdentifiable {
  name: string;
  phoneNumber?: string;
  vatNumber?: string;
}
