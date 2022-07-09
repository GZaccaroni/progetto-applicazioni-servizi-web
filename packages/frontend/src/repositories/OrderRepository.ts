import Client from "@/repositories/common/AxiosClient";
import {
  PaginatedFindInput,
  PaginatedResult,
} from "@/repositories/common/PaginatedResult";
import { omit } from "lodash";
import { DbOrder } from "@/model/db/DbOrder";
import { Cancellable } from "@/repositories/common/Cancellable";
import { observePaginatedResult } from "@/repositories/common/ObserveUtils";
import { UpdateOrderInput } from "@/model/UpdateOrderInput";
import { CreateOrderInput } from "@/model/CreateOrderInput";

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
): Cancellable {
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

export async function addOrder(data: CreateOrderInput): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export async function updateOrder(input: UpdateOrderInput): Promise<void> {
  const result = await Client.post<void>(
    `${resource}/${input.id}`,
    omit(input, "id")
  );
  return result.data;
}
export async function deleteOrder(id: string): Promise<void> {
  const result = await Client.delete<void>(`${resource}/${id}`);
  return result.data;
}
