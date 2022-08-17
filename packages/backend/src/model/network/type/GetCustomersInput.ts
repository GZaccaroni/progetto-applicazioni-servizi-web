import { PaginateParams } from "./PaginateParams";
import { FilterByName } from "./FilterByName";

export interface GetCustomersInput extends PaginateParams, FilterByName {}
