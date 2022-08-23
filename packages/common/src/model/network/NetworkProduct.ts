import { NetworkIdentifiable } from "./NetworkIdentifiable";
import {QuantityUnitOfMeasure} from "../common/QuantityUnitOfMeasure";

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

export interface NetworkProductKindIdentifier {
  productId: string;
  variantId?: string;
}
