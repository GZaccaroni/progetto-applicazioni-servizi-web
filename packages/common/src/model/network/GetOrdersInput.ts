import { PaginateParams } from "./PaginateParams";
import { FilterByDate } from "./FilterByDate";
import { FilterByStore } from "./FilterByStore";

export interface GetOrdersInput
  extends PaginateParams,
    FilterByDate,
    FilterByStore {}
