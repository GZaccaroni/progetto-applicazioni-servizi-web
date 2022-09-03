// Adapted from https://github.com/IGLU-Agency/mongoose-paginate-ts
import {
  FilterQuery,
  Model,
  PopulateOptions,
  ProjectionType,
  Schema,
} from "mongoose";
import objectPath from "object-path";
import {
  PaginatedResult,
  PaginatedResultCursors,
} from "@common/model/common/PaginatedResult";
import { DbIdentifiable } from "@/utils/utils";
import bsonUrlEncoding from "./bsonUrlEncoding";
import { clone, omit } from "lodash";

export interface PaginationOptions<T extends DbIdentifiable> {
  query?: FilterQuery<T>;
  populate?: PopulateOptions;
  paginatedField: keyof T & string;
  sortAscending: boolean;
  projection?: ProjectionType<T> | undefined;
  lean?: boolean;
  limit: number;
  cursors?: PaginatedResultCursors;
}

export interface Pagination<T extends DbIdentifiable> extends Model<T> {
  paginate(
    options?: PaginationOptions<T> | undefined
  ): Promise<PaginatedResult<T>>;
}

export function mongoosePagination<T extends DbIdentifiable>(
  schema: Schema<T>
) {
  schema.statics.paginate = async function paginate(
    options: PaginationOptions<T>
  ): Promise<PaginatedResult<T>> {
    const query = options?.query ?? {};
    const populate = options?.populate ?? undefined;
    const sort = generateSort(options);
    const projection = clone(options?.projection);
    const lean = options?.lean ?? true;
    const limit = options.limit > 0 ? options.limit : 0;
    const cursorQuery = generateCursorQuery(options);
    //MARK: QUERY

    const removeIdInResponse =
      projection && typeof projection == "object" && projection["_id"] == 0;
    if (removeIdInResponse) {
      projection["_id"] = 1;
    }

    let mQuery = this.find<T>({ $and: [cursorQuery, query] }, projection);
    if (lean) {
      mQuery = mQuery.lean();
    }
    if (populate != undefined) {
      mQuery = mQuery.populate(populate);
    }

    if (sort != undefined) {
      mQuery = mQuery.sort(sort);
    }
    mQuery = mQuery.limit(limit + 1);

    //MARK: PERFORM
    const docs: T[] = await mQuery.exec();
    const response = prepareResponse(docs, options);

    if (removeIdInResponse) {
      response.results = response.results.map((el) => omit(el, "_id")) as never;
    }
    return response;
  };
}
function prepareResponse<T extends DbIdentifiable>(
  results: T[],
  options: PaginationOptions<T>
): PaginatedResult<T> {
  const hasMore = results.length > options.limit;
  // Remove the extra element that we added to 'peek' to see if there were more entries.
  if (hasMore) results.pop();

  const hasPrevious =
    !!options.cursors?.next || !!(options.cursors?.previous && hasMore);
  const hasNext = !!options.cursors?.previous || hasMore;

  // If we sorted reverse to get the previous page, correct the sort order.
  if (options.cursors?.previous) results = results.reverse();

  const cursors = encodePaginationTokens(
    options,
    hasPrevious ? results[0] : undefined,
    hasNext ? results[results.length - 1] : undefined
  );

  return {
    results,
    hasNext,
    hasPrevious,
    cursors,
  };
}

function generateCursorQuery<T extends DbIdentifiable>(
  options: PaginationOptions<T>
): FilterQuery<T> {
  if (!options.cursors) return {};
  const sortAsc =
    (!options.sortAscending && options.cursors.previous) ||
    (options.sortAscending && !options.cursors.previous);
  const comparisonOp = sortAsc ? "$gt" : "$lt";
  const cursorNext =
    options.cursors.next != undefined
      ? bsonUrlEncoding.decode(options.cursors.next)
      : undefined;
  const cursorPrevious =
    options.cursors.previous != undefined
      ? bsonUrlEncoding.decode(options.cursors.previous)
      : undefined;
  // a `next` cursor will have precedence over a `previous` cursor.
  let op: unknown;
  if (cursorNext != undefined) {
    op = cursorNext;
  } else if (cursorPrevious != undefined) {
    op = cursorPrevious;
  } else {
    return {};
  }

  if (options.paginatedField == "_id") {
    return {
      _id: {
        [comparisonOp]: op,
      },
    };
  } else if (Array.isArray(op)) {
    const field = options.paginatedField;
    return {
      $or: [
        {
          [field]: {
            [comparisonOp]: op[0],
          },
        },
        {
          [field]: {
            $eq: op[0],
          },
          _id: {
            [comparisonOp]: op[1],
          },
        },
      ],
    } as FilterQuery<T>;
  } else {
    return {};
  }
}
function generateSort<T extends DbIdentifiable>(options: PaginationOptions<T>) {
  const sortAsc =
    (!options.sortAscending && options.cursors?.previous) ||
    (options.sortAscending && !options.cursors?.previous);
  const sortDir = sortAsc ? 1 : -1;

  if (options.paginatedField == "_id") {
    return {
      _id: sortDir,
    };
  } else {
    const field = options.paginatedField;
    return {
      [field]: sortDir,
      _id: sortDir,
    };
  }
}

function encodePaginationTokens<T extends DbIdentifiable>(
  options: PaginationOptions<T>,
  previous?: T,
  next?: T
): PaginatedResultCursors {
  const shouldSecondarySortOnId = options.paginatedField !== "_id";
  const cursors: PaginatedResultCursors = {};
  if (previous) {
    const previousPaginatedField = objectPath.get(
      previous,
      options.paginatedField
    );
    if (shouldSecondarySortOnId) {
      cursors.previous = bsonUrlEncoding.encode([
        previousPaginatedField,
        previous._id,
      ]);
    } else {
      cursors.previous = bsonUrlEncoding.encode(previousPaginatedField);
    }
  }
  if (next) {
    const nextPaginatedField = objectPath.get(next, options.paginatedField);
    if (shouldSecondarySortOnId) {
      cursors.next = bsonUrlEncoding.encode([nextPaginatedField, next._id]);
    } else {
      cursors.next = bsonUrlEncoding.encode(nextPaginatedField);
    }
  }
  return cursors;
}
