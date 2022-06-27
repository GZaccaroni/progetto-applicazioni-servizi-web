import { DbUnitOfMeasure } from "./DbUnitOfMeasure";
import { DbIdentifiable } from "./DbIdentifiable";

export enum DbItemGrade {
  First = "first",
  Second = "second",
  Mixed = "mixed",
}
export interface DbProductKind {
  id?: string;
  name: string;
  pricePerUnit?: number;
}
export interface DbProductKindIdentifier {
  productId: string;
  variantId: string;
}
export interface DbProduct extends DbIdentifiable {
  name: string;
  pricePerUnit?: number;
  grade?: DbItemGrade;
  kinds: DbProductKind[];
  unitOfMeasure: DbUnitOfMeasure;
}
