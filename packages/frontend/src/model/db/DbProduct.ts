import { DbUnitOfMeasure } from "./DbUnitOfMeasure";
import { DbIdentifiable } from "./DbIdentifiable";

export enum DbProductGrade {
  first = "first",
  second = "second",
  mixed = "mixed",
}
export interface DbProductKind {
  id: string;
  name: string;
  pricePerUnit?: number;
}
export interface DbProductKindIdentifier {
  productId: string;
  variantId?: string;
}
export interface DbProduct extends DbIdentifiable {
  name: string;
  pricePerUnit?: number;
  kinds: DbProductKind[];
  unitOfMeasure: DbUnitOfMeasure;
}
