import { NetworkProductKind } from "./NetworkProductKind";
import { QuantityUnitOfMeasure } from "../../common/QuantityUnitOfMeasure";

export interface NetworkProduct {
  name: string;
  pricePerUnit?: number;
  kinds: NetworkProductKind[];
  unitOfMeasure: QuantityUnitOfMeasure;
}
