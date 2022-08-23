import {ProductGrade} from "../common/ProductGrade";

export interface CreateUpdateOrderInput {
  customerId: string;
  storeId: string;
  date: string;
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
