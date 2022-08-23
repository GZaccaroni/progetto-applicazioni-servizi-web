import Client from "@/repositories/common/AxiosClient";
import {
  PaginatedFindInput,
  PaginatedResult,
} from "@/repositories/common/PaginatedResult";
import { NetworkStore } from "@common/model/network/NetworkStore";
import { Cancellable } from "@/repositories/common/Cancellable";
import { observePaginatedResult } from "@/repositories/common/ObserveUtils";
import { CreateUpdateStoreInput } from "@common/model/network/CreateUpdateStoreInput";

const resource = "/store";

export interface FindStoresInput extends PaginatedFindInput {
  authorized?: boolean;
  searchName?: string;
  limit: number;
}
export function observeStores(
  input: FindStoresInput,
  onNext: (result: PaginatedResult<NetworkStore>) => void,
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
): Promise<PaginatedResult<NetworkStore>> {
  const result = await Client.get<PaginatedResult<NetworkStore>>(
    `${resource}/find`,
    {
      params: input,
    }
  );
  return result.data;
}
export async function findStore(id: string): Promise<NetworkStore> {
  const result = await Client.get<NetworkStore>(`${resource}/${id}`);
  return result.data;
}
export async function addStore(data: CreateUpdateStoreInput): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export async function updateStore(
  id: string,
  data: CreateUpdateStoreInput
): Promise<void> {
  const result = await Client.post<void>(`${resource}/${id}`, data);
  return result.data;
}
export async function deleteStore(id: string): Promise<void> {
  const result = await Client.delete<void>(`${resource}/${id}`);
  return result.data;
}
