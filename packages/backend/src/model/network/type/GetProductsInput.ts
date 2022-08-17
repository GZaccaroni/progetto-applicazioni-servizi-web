import { PaginateParams } from "./PaginateParams";
import { FilterByName } from "./FilterByName";

export interface GetProductsInput extends PaginateParams, FilterByName {}
