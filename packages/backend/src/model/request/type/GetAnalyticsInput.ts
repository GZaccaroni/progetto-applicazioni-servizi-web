import { FilterByStore } from "./FilterByStore";
import { FilterByDate } from "./FilterByDate";
import { FilterByCustomer } from "./FilterByCustomer";
import { FilterByProducts } from "./FilterByProducts";

export interface GetAnalyticsInput
  extends FilterByStore,
    FilterByDate,
    FilterByCustomer,
    FilterByProducts {
  dataType: DataTypeEnum;
}

export enum DataTypeEnum {
  Quantity = "quantity",
  Price = "price",
}
