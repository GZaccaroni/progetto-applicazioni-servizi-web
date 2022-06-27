import Client from "@/repositories/common/AxiosClient";
import {
  PaginatedFindInput,
  PaginatedResult,
} from "@/repositories/common/PaginatedResult";
import { omit } from "lodash";
import { DbProduct } from "@/model/db/DbProduct";
import { Cancellable } from "@/repositories/common/Cancellable";
import { observePaginatedResult } from "@/repositories/common/ObserveUtils";

const resource = "/item";

export interface FindItemsInput extends PaginatedFindInput {
  searchName?: string;
  limit: number;
}
export function observeItems(
  input: FindItemsInput,
  onNext: (result: PaginatedResult<DbProduct>) => void,
  onError: (error: { code: string; message: string }) => void
): Cancellable {
  return observePaginatedResult(
    input,
    findItems,
    "productChanged",
    onNext,
    onError
  );
}
export async function findItems(
  input: FindItemsInput
): Promise<PaginatedResult<DbProduct>> {
  const result = await Client.get<PaginatedResult<DbProduct>>(`${resource}/find`, {
    params: input,
  });
  return result.data;
}
export async function findItem(id: string): Promise<DbProduct> {
  const result = await Client.get<DbProduct>(`${resource}/${id}`);
  return result.data;
}
export async function addItem(data: Omit<DbProduct, "id">): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export async function updateItem(item: DbProduct): Promise<void> {
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
