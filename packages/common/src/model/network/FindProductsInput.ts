import { PaginateParams } from "./PaginateParams";
import { FilterByName } from "./FilterByName";

export interface FindProductsInput extends PaginateParams, FilterByName {}
