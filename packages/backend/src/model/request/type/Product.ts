import { ProductKind } from "./ProductKind";

export interface Product {
  name: string;
  pricePerUnit?: number;
  kinds: Array<ProductKind>;
  /**
   * Order Status
   */
  unitOfMeasure: UnitOfMeasureEnum;
}

export type UnitOfMeasureEnum = "kilogram" | "piece";
export const UnitOfMeasureEnum = {
  Kilogram: "kilogram" as UnitOfMeasureEnum,
  Piece: "piece" as UnitOfMeasureEnum,
};
