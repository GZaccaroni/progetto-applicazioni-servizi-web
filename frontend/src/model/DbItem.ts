import { DbUnitOfMeasure } from "@/model/DbUnitOfMeasure";
import { DbIdentifiable } from "@/model/DbIdentifiable";

export enum ItemGrade {
  First = "first",
  Second = "second",
  Mixed = "mixed",
}
export interface ItemKind {
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
  grade?: ItemGrade;
  kinds: ItemKind[];
  unitOfMeasure: DbUnitOfMeasure;
}
