import { PaginateParams } from "./PaginateParams";
import { FilterByName } from "./FilterByName";

export interface FindCustomersInput extends PaginateParams, FilterByName {}
