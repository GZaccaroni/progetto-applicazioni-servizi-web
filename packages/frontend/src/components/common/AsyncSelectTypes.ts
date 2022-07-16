import { DbIdentifiable } from "@/model/db/DbIdentifiable";

export interface AsyncSelectItem extends DbIdentifiable {
  id: string;
  text: string;
}
export type FindSelectItemsInput =
  | { ids: string[]; query?: undefined }
  | { ids?: undefined; query: string };
export type FindSelectItemsFn = (
  input?: FindSelectItemsInput
) => Promise<AsyncSelectItem[]>;
