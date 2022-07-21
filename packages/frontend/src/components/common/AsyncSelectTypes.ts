import { DbIdentifiable } from "@/model/db/DbIdentifiable";

export interface AsyncSelectItem<T> extends DbIdentifiable {
  id: string;
  text: string;
  item?: T;
}
export type FindSelectItemsInput =
  | { ids: string[]; query?: undefined }
  | { ids?: undefined; query: string };
export type FindSelectItemsFn = (
  input?: FindSelectItemsInput
) => Promise<AsyncSelectItem<unknown>[]>;
