import Client from "@/repositories/common/AxiosClient";
import { PaginatedResult } from "@/repositories/common/PaginatedResult";
import { omit } from "lodash";
import {DbStore} from "@/model/db/DbStore";

const resource = "/store";

export interface FindStoresInput {
  authorized?: boolean;
  pagingNext?: string;
  pagingPrevious?: string;
  searchName?: string;
  limit: number;
}
export async function findStores(
  input: FindStoresInput
): Promise<PaginatedResult<DbStore[]>> {
  const result = await Client.get<PaginatedResult<DbStore[]>>(
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
export async function addStore(data: Omit<DbStore, "id">): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export async function updateStore(item: DbStore): Promise<void> {
  const result = await Client.post<void>(
    `${resource}/${item.id}`,
    omit(item, "id")
  );
  return result.data;
}
export async function deleteStore(id: string): Promise<void> {
  const result = await Client.delete<void>(`${resource}/${id}`);
  return result.data;
}
