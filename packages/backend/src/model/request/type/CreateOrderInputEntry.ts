export interface CreateOrderInputEntry {
  productId: string;
  variantId?: string;
  grade?: GradeEnum;
  quantity: number;
  pricePerUnit: number;
}

export enum GradeEnum {
  First = "first",
  Second = "second",
  Mixed = "mixed",
}
