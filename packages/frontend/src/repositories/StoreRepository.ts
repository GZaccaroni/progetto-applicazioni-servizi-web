import Client from "@/repositories/common/AxiosClient";
import {
  PaginatedFindInput,
  PaginatedResult,
} from "@/repositories/common/PaginatedResult";
import { omit } from "lodash";
import { DbStore } from "@/model/db/DbStore";
import { Cancellable } from "@/repositories/common/Cancellable";
import { observePaginatedResult } from "@/repositories/common/ObserveUtils";
import { DbIdentifiable } from "@/model/db/DbIdentifiable";
import { CreateStoreInput } from "@/model/CreateStoreInput";
import { UpdateStoreInput } from "@/model/UpdateStoreInput";

const resource = "/store";

export interface FindStoresInput extends PaginatedFindInput {
  authorized?: boolean;
  searchName?: string;
  limit: number;
}
export function observeStores(
  input: FindStoresInput,
  onNext: (result: PaginatedResult<DbStore>) => void,
  onError: (error: { code: string; message: string }) => void
): Cancellable {
  return observePaginatedResult(
    input,
    findStores,
    "storeChanged",
    onNext,
    onError
  );
}
export async function findStores(
  input: FindStoresInput
): Promise<PaginatedResult<DbStore>> {
  const result = await Client.get<PaginatedResult<DbStore>>(
    `${resource}/find`,
    {
      params: input,
    }
  );
  return result.data;
}
export async function findStore(id: string): Promise<DbStore> {
  const result = await Client.get<DbStore>(`${resource}/${id}`);
  return result.data;
}
export async function addStore(data: CreateStoreInput): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export async function updateStore(input: UpdateStoreInput): Promise<void> {
  const result = await Client.post<void>(
    `${resource}/${input.id}`,
    omit(input, "id")
  );
  return result.data;
}
export async function deleteStore(id: string): Promise<void> {
  const result = await Client.delete<void>(`${resource}/${id}`);
  return result.data;
}
