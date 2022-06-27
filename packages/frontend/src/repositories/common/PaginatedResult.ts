export interface PaginatedFindInput {
  pagingNext?: string;
  pagingPrevious?: string;
  limit: number;
}
export interface PaginatedResult<T> {
  results: T[];
  hasNext: boolean;
  previous?: string;
  next?: string;
}
