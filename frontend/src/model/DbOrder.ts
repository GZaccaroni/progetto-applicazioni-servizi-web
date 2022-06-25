import { DbCustomer } from "./DbCustomer";
import { DbStore } from "./DbStore";
import { DbIdentifiable } from "@/model/DbIdentifiable";

export interface DbOrderEntry {
  itemId: string;
  variantId?: string;
  itemFullName: string;
  quantity: number;
  pricePerUnit: number;
  price: number;
}
export interface DbOrder extends DbIdentifiable {
  customer?: DbCustomer;
  store?: DbStore;
  date: Date;
  entries: DbOrderEntry[];
  price: number;
  note?: string;
}
