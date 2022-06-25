import { DbCustomer } from "./DbCustomer";
import { DbIdentifiable } from "./DbIdentifiable";

export interface DbOrderEntry {
  itemId: string;
  variantId?: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
  price: number;
}
export interface DbOrder extends DbIdentifiable {
  customer?: DbCustomer;
  storeId: string;
  storeName: string;
  date: Date;
  entries: DbOrderEntry[];
  price: number;
  note?: string;
}
