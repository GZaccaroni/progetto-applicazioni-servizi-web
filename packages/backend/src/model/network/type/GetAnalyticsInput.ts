import { FilterByStore } from "./FilterByStore";
import { FilterByDate } from "./FilterByDate";
import { FilterByCustomer } from "./FilterByCustomer";
import { FilterByProducts } from "./FilterByProducts";
import { ChartDataType } from "../../common/ChartDataType";

export interface GetAnalyticsInput
  extends FilterByStore,
    FilterByDate,
    FilterByCustomer,
    FilterByProducts {
  dataType: ChartDataType;
}
