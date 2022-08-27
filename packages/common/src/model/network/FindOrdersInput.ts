import { PaginateParams } from "./PaginateParams";
import { FilterByDate } from "./FilterByDate";
import { FilterByStore } from "./FilterByStore";

export interface FindOrdersInput
  extends PaginateParams,
    FilterByDate,
    FilterByStore {}
