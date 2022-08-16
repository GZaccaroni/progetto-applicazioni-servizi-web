import { QuantityUnitOfMeasure } from "../../common/QuantityUnitOfMeasure";

export interface NetworkProduct {
  name: string;
  pricePerUnit?: number;
  kinds: NetworkProductKind[];
  unitOfMeasure: QuantityUnitOfMeasure;
}
export interface NetworkProductKind {
  id: string;
  name: string;
  pricePerUnit?: number;
}
