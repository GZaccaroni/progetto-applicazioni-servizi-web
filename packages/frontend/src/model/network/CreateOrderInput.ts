import { ProductGrade } from "@/model/common/ProductGrade";

export interface CreateOrderInput {
  customerId: string;
  storeId: string;
  date: Date;
  entries: CreateOrderInputEntry[];
  note?: string;
}
export interface CreateOrderInputEntry {
  productId: string;
  variantId?: string;
  pricePerUnit: number;
  quantity: number;
  grade?: ProductGrade;
}
