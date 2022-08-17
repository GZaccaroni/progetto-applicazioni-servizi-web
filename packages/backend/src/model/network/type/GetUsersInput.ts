import { PaginateParams } from "./PaginateParams";
import { FilterByName } from "./FilterByName";

export interface GetUsersInput extends PaginateParams, FilterByName {}
