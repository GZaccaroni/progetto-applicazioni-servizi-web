import { PaginateParams } from "./PaginateParams";
import { FilterByName } from "./FilterByName";

export interface GetStoresInput extends PaginateParams, FilterByName {
  authorized: boolean;
}
