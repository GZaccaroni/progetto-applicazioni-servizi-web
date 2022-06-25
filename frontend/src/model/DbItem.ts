import { DbUnitOfMeasure } from "@/model/DbUnitOfMeasure";
import { DbIdentifiable } from "@/model/DbIdentifiable";

export enum DbItemGrade {
  First = "first",
  Second = "second",
  Mixed = "mixed",
}
export interface DbItemKind {
  id?: string;
  name: string;
  pricePerUnit?: number;
}
export interface DbItemKindIdentifier {
  itemId: string;
  variantId: string;
}
export interface DbItem extends DbIdentifiable {
  name: string;
  pricePerUnit?: number;
  grade?: DbItemGrade;
  kinds: DbItemKind[];
  unitOfMeasure: DbUnitOfMeasure;
}
