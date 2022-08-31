import { PaginateParams } from "./PaginateParams";
import { FilterByName } from "./FilterByName";

export interface FindStoresInput extends PaginateParams, FilterByName {
  authorized?: boolean;
}
