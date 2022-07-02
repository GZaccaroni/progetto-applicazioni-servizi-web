declare module 'mongoose' {
  export interface IPaginateOptions {
    query: any;
    limit?: number;
    next?: string;
  }

  export interface PaginateResult<T> {
    results: Array<T>;
    next: string;
  }

  export interface IPaginateModel<T extends Document> extends Model<T> {
    paginate(options: IPaginateOptions): Promise<PaginateResult<T>>;
  }

  export function model<T extends Document>(
    name: string,
    schema?: Schema,
    collection?: string,
    skipInit?: boolean,
  ): IPaginateModel<T>;

  export function model<T extends Document, U extends IPaginateModel<T>>(
    name: string,
    schema?: Schema,
    collection?: string,
    skipInit?: boolean,
  ): U;
}

declare module "mongo-cursor-pagination" {
  import mongoose from 'mongoose';
  export function mongoosePlugin(schema: mongoose.Schema): void;
}