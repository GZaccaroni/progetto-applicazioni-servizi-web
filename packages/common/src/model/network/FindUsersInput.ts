import { PaginateParams } from "./PaginateParams";
import { FilterByName } from "./FilterByName";

export interface FindUsersInput extends PaginateParams, FilterByName {}
