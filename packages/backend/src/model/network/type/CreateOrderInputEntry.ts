import { ProductGrade } from "../../common/ProductGrade";

export interface CreateOrderInputEntry {
  productId: string;
  variantId?: string;
  grade?: ProductGrade;
  quantity: number;
  pricePerUnit: number;
}
