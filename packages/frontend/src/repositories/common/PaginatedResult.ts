export interface PaginatedFindInput {
  pagingNext?: string;
  pagingPrevious?: string;
}
export interface PaginatedResult<T> {
  results: T[];
  hasNext: boolean;
  previous?: string;
  next?: string;
}
