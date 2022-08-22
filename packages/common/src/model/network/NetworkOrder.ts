import { NetworkCustomer } from "./NetworkCustomer";
import { NetworkIdentifiable } from "./NetworkIdentifiable";
import {ProductGrade} from "../common/ProductGrade";

export interface DbOrderEntry {
  productId: string;
  variantId?: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
  price: number;
  grade?: ProductGrade;
}
export interface NetworkOrder extends NetworkIdentifiable {
  customer?: NetworkCustomer;
  store: {
    id: string;
    name: string;
  };
  date: string;
  entries: DbOrderEntry[];
  price: number;
  note?: string;
}
