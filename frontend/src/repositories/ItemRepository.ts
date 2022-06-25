import Client from "@/repositories/common/AxiosClient";
import { DbItem } from "@/model/DbItem";
import { PaginatedResult } from "@/repositories/common/PaginatedResult";
import { omit } from "lodash";

const resource = "/item";

export interface FindItemsInput {
  pagingNext?: string;
  pagingPrevious?: string;
  searchName?: string;
  limit: number;
}
export async function findItems(
  input: FindItemsInput
): Promise<PaginatedResult<DbItem[]>> {
  const result = await Client.get<PaginatedResult<DbItem[]>>(
    `${resource}/find`,
    {
      params: input,
    }
  );
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
