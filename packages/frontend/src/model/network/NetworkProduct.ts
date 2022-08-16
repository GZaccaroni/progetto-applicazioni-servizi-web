import { QuantityUnitOfMeasure } from "../common/QuantityUnitOfMeasure";
import { NetworkIdentifiable } from "./NetworkIdentifiable";

export interface NetworkProduct extends NetworkIdentifiable {
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
export interface DbProductKindIdentifier {
  productId: string;
  variantId?: string;
}
