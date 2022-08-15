import { PaginateParams } from "./PaginateParams";
import { FilterByName } from "./FilterByName";

export interface GetStores extends PaginateParams, FilterByName {
  authorized: boolean;
}
