import { DbCustomer } from "./DbCustomer";
import { DbIdentifiable } from "./DbIdentifiable";
import { DbProductGrade } from "@/model/db/DbProduct";

export interface DbOrderEntry {
  productId: string;
  variantId?: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
  price: number;
  grade?: DbProductGrade;
}
export interface DbOrder extends DbIdentifiable {
  customer?: DbCustomer;
  store: {
    id: string;
    name: string;
  };
  date: Date;
  entries: DbOrderEntry[];
  price: number;
  note?: string;
}
