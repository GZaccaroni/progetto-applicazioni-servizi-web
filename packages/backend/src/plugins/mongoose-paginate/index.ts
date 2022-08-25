// Adapted from https://github.com/IGLU-Agency/mongoose-paginate-ts
import {
  Schema,
  Model,
  FilterQuery,
  ProjectionType,
  PopulateOptions,
  SortOrder,
} from "mongoose";

export class PaginationModel<T> {
  hasPrevPage: boolean;
  hasNextPage: boolean;
  cursorNextPage: boolean | undefined = false;
  docs: T[] = [];
}

export interface PaginationOptions<T> {
  key?: string | undefined;
  query?: FilterQuery<T>;
  populate?: PopulateOptions;
  sort?:
    | string
    | { [key: string]: SortOrder | { $meta: "textScore" } }
    | undefined;
  projection?: ProjectionType<T> | undefined;
  lean?: boolean;
  startingAfter?: any;
  endingBefore?: any;
  limit: number;
}

export interface Pagination<T> extends Model<T> {
  paginate(
    options?: PaginationOptions<T> | undefined
  ): Promise<PaginationModel<T>>;
}

export function mongoosePagination<T>(schema: Schema<T>) {
  schema.statics.paginate = async function paginate(
    options: PaginationOptions<T>
  ): Promise<PaginationModel<T>> {
    console.log("Options", options);
    const key = options?.key ?? "_id";
    const query = options?.query ?? {};
    const populate = options?.populate ?? undefined;
    const sort = options?.sort ?? undefined;
    const projection = options?.projection ?? {};
    const lean = options?.lean ?? true;
    const startingAfter = options?.startingAfter ?? undefined;
    const endingBefore = options?.endingBefore ?? undefined;
    const limit = options.limit > 0 ? options.limit : 0;
    if (
      query != undefined &&
      (startingAfter != undefined || endingBefore != undefined)
    ) {
      query[key] = {};
      if (endingBefore != undefined) {
        query[key] = { $lt: endingBefore };
      } else {
        query[key] = { $gt: startingAfter };
      }
    }
    //MARK: QUERY
    console.log("Projection", projection);
    let mQuery = this.find<T>(query, projection);
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
    console.log("Preresult", mQuery);
    const docs = await mQuery.exec();
    console.log("Result", docs);
    const meta = new PaginationModel<T>();
    const hasMore = docs.length === limit + 1;
    if (hasMore) {
      docs.pop();
    }

    if (endingBefore != undefined) {
      meta.hasPrevPage = hasMore;
      meta.hasNextPage = true;
    } else {
      meta.hasPrevPage = true;
      meta.hasNextPage = hasMore;
    }
    meta.docs = docs;
    return meta;
  };
}
