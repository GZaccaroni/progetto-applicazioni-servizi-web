import {
  PaginationModel,
  PaginationOptions,
} from "@/plugins/mongoose-paginate";
import { PaginatedResult } from "@colture-in-cloud/frontend/src/repositories/common/PaginatedResult";
import { QueryOptions } from "mongoose";

export function paginateResponse<T>(
  result: PaginationModel<T>
): PaginatedResult<T> {
  const responseBody = {
    results: result.docs,
    hasNext: result.hasNextPage,
  };
  if (!result.hasPrevPage) {
    responseBody["hasPrevious"] = false;
  } else {
    if (result.docs.length > 0) {
      responseBody["previous"] = "result.docs.at(0)?._id";
    }
  }
  if (result.hasNextPage) {
    responseBody["next"] = "result.docs.at(-1)?._id";
  }
  return responseBody;
}

export function paginateOptions<T>(
  query: QueryOptions<T>,
  projection,
  sort,
  limit: number,
  pagingNext: any,
  pagingPrevious: any
): PaginationOptions<T> {
  const options = { limit: limit, projection: projection, sort: sort };
  if (query) {
    options["query"] = query;
  }
  if (pagingNext) {
    options["startingAfter"] = pagingNext;
  } else {
    if (pagingPrevious) {
      options["endingBefore"] = pagingPrevious;
    }
  }
  return options;
}
