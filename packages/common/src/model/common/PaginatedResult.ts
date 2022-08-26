export interface PaginatedResult<T> {
  results: T[];
  hasNext: boolean;
  hasPrevious: boolean;
  cursors: PaginatedResultCursors;
}
export type PaginatedResultCursors = {
  next?: string;
  previous?: string;
};
