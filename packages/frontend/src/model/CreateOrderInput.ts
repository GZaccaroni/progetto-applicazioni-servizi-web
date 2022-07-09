import { DbProductGrade } from "@/model/db/DbProduct";

export interface CreateOrderEntry {
  productId: string;
  variantId?: string;
  pricePerUnit: number;
  grade?: DbProductGrade;
}
export interface CreateOrderInput {
  customerId: string;
  storeId: string;
  date: Date;
  entries: CreateOrderEntry[];
  note?: string;
}
