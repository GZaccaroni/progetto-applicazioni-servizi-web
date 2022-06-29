import Client from "@/repositories/common/AxiosClient";
import {
  PaginatedFindInput,
  PaginatedResult,
} from "@/repositories/common/PaginatedResult";
import { omit } from "lodash";
import { DbCustomer } from "@/model/db/DbCustomer";
import { Cancellable } from "@/repositories/common/Cancellable";
import { observePaginatedResult } from "@/repositories/common/ObserveUtils";
import {DbIdentifiable} from "@/model/db/DbIdentifiable";

const resource = "/customer";

export function observeCustomers(
  input: FindCustomersInput,
  onNext: (result: PaginatedResult<DbCustomer>) => void,
  onError: (error: { code: string; message: string }) => void
): Cancellable {
  return observePaginatedResult(
    input,
    findCustomers,
    "customerChanged",
    onNext,
    onError
  );
}
export interface FindCustomersInput extends PaginatedFindInput {
  searchName?: string;
  limit: number;
}
export async function findCustomers(
  input: FindCustomersInput
): Promise<PaginatedResult<DbCustomer>> {
  const result = await Client.get<PaginatedResult<DbCustomer>>(
    `${resource}/find`,
    {
      params: input,
    }
  );
  return result.data;
}
export async function findCustomer(id: string): Promise<DbCustomer> {
  const result = await Client.get<DbCustomer>(`${resource}/${id}`);
  return result.data;
}
export async function addCustomer(
  data: Omit<DbCustomer, keyof DbIdentifiable>
): Promise<void> {
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
