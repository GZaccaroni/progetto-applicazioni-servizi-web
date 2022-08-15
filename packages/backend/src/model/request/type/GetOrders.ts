import { PaginateParams } from "./PaginateParams";
import { FilterByDate } from "./FilterByDate";
import { FilterByStore } from "./FilterByStore";

export interface GetOrders
  extends PaginateParams,
    FilterByDate,
    FilterByStore {}
