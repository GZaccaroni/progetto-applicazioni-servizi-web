import Client from "@/repositories/common/AxiosClient";
import { DbItem } from "@/model/DbItem";
import { PaginatedResult } from "@/repositories/common/PaginatedResult";
import { omit } from "lodash";
import { DbCustomer } from "@/model/DbCustomer";

const resource = "/customer";

export interface FindCustomersInput {
  pagingNext?: string;
  pagingPrevious?: string;
  searchName?: string;
  limit: number;
}
export async function findCustomers(
  input: FindCustomersInput
): Promise<PaginatedResult<DbCustomer[]>> {
  const result = await Client.get<PaginatedResult<DbCustomer[]>>(
    `${resource}/find`,
    {
      params: input,
    }
  );
  return result.data;
}
export async function findCustomer(id: string): Promise<DbCustomer> {
  const result = await Client.get<DbItem>(`${resource}/${id}`);
  return result.data;
}
export async function addCustomer(data: Omit<DbCustomer, "id">): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export async function updateCustomer(item: DbCustomer): Promise<void> {
  const result = await Client.post<void>(
    `${resource}/${item.id}`,
    omit(item, "id")
  );
  return result.data;
}
export async function deleteCustomer(id: string): Promise<void> {
  const result = await Client.delete<void>(`${resource}/${id}`);
  return result.data;
}
