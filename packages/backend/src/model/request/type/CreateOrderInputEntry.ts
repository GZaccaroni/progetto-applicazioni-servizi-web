export interface CreateOrderInputEntry {
  productId: string;
  variantId?: string;
  grade?: GradeEnum;
  quantity: number;
  pricePerUnit: number;
}

export type GradeEnum = "first" | "second" | "mixed";
export const GradeEnum = {
  First: "first" as GradeEnum,
  Second: "second" as GradeEnum,
  Mixed: "mixed" as GradeEnum,
};
