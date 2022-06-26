import Client from "@/repositories/common/AxiosClient";
import {PaginatedFindInput, PaginatedResult} from "@/repositories/common/PaginatedResult";
import { omit } from "lodash";
import { DbOrder } from "@/model/db/DbOrder";
import { Unsubscribe } from "@/repositories/common/Unsubscribe";
import { observePaginatedResult } from "@/repositories/common/ObserveUtils";

const resource = "/order";

export interface FindOrdersInput extends PaginatedFindInput {
  storeId?: string;
  fromDate?: Date;
  toDate?: Date;
  limit: number;
}
export function observeOrders(
  input: FindOrdersInput,
  onNext: (result: PaginatedResult<DbOrder>) => void,
  onError: (error: { code: string; message: string }) => void
): Unsubscribe {
  return observePaginatedResult(
    input,
    findOrders,
    "orderChanged",
    onNext,
    onError
  );
}
export async function findOrders(
  input: FindOrdersInput
): Promise<PaginatedResult<DbOrder>> {
  const result = await Client.get<PaginatedResult<DbOrder>>(
    `${resource}/find`,
    {
      params: input,
    }
  );
  return result.data;
}
export async function findOrder(id: string): Promise<DbOrder> {
  const result = await Client.get<DbOrder>(`${resource}/${id}`);
  return result.data;
}

export async function addOrder(data: Omit<DbOrder, "id">): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export async function updateOrder(item: DbOrder): Promise<void> {
  const result = await Client.post<void>(
    `${resource}/${item.id}`,
    omit(item, "id")
  );
  return result.data;
}
export async function deleteOrder(id: string): Promise<void> {
  const result = await Client.delete<void>(`${resource}/${id}`);
  return result.data;
}
