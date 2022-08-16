import { NetworkIdentifiable } from "@/model/network/NetworkIdentifiable";

export interface AsyncSelectItem<T> extends NetworkIdentifiable {
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
