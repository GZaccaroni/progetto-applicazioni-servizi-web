import Client from "@/repositories/common/AxiosClient";
import {
  PaginatedFindInput,
  PaginatedResult,
} from "@/repositories/common/PaginatedResult";
import { omit } from "lodash";
import { DbItem } from "@/model/db/DbItem";
import { Unsubscribe } from "@/repositories/common/Unsubscribe";
import { observePaginatedResult } from "@/repositories/common/ObserveUtils";

const resource = "/item";

export interface FindItemsInput extends PaginatedFindInput {
  searchName?: string;
  limit: number;
}
export function observeItems(
  input: FindItemsInput,
  onNext: (result: PaginatedResult<DbItem>) => void,
  onError: (error: { code: string; message: string }) => void
): Unsubscribe {
  return observePaginatedResult(
    input,
    findItems,
    "itemChanged",
    onNext,
    onError
  );
}
export async function findItems(
  input: FindItemsInput
): Promise<PaginatedResult<DbItem>> {
  const result = await Client.get<PaginatedResult<DbItem>>(`${resource}/find`, {
    params: input,
  });
  return result.data;
}
export async function findItem(id: string): Promise<DbItem> {
  const result = await Client.get<DbItem>(`${resource}/${id}`);
  return result.data;
}
export async function addItem(data: Omit<DbItem, "id">): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export async function updateItem(item: DbItem): Promise<void> {
  const result = await Client.post<void>(
    `${resource}/${item.id}`,
    omit(item, "id")
  );
  return result.data;
}
export async function deleteItem(id: string): Promise<void> {
  const result = await Client.delete<void>(`${resource}/${id}`);
  return result.data;
}
