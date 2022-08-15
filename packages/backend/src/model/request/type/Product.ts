import { ProductKind } from "./ProductKind";

export interface Product {
  name: string;
  pricePerUnit?: number;
  kinds: ProductKind[];
  unitOfMeasure: UnitOfMeasureEnum;
}

export enum UnitOfMeasureEnum {
  Kilogram = "kilogram",
  Piece = "piece",
}
