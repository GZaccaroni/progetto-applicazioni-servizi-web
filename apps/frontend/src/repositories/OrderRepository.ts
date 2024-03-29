import Client from "@/repositories/common/AxiosClient";
import { PaginatedResult } from "@common/model/common/PaginatedResult";
import { NetworkOrder } from "@common/model/network/NetworkOrder";
import { Cancellable } from "@/repositories/common/Cancellable";
import { observePaginatedResult } from "@/repositories/common/ObserveUtils";
import { CreateUpdateOrderInput } from "@common/model/network/CreateUpdateOrderInput";
import { FindOrdersInput } from "@common/model/network/FindOrdersInput";

const resource = "/order";

export function observeOrders(
  input: FindOrdersInput,
  onNext: (result: PaginatedResult<NetworkOrder>) => void,
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
): Promise<PaginatedResult<NetworkOrder>> {
  const result = await Client.get<PaginatedResult<NetworkOrder>>(
    `${resource}/find`,
    {
      params: input,
    }
  );
  return result.data;
}
export async function findOrder(id: string): Promise<NetworkOrder> {
  const result = await Client.get<NetworkOrder>(`${resource}/${id}`);
  return result.data;
}

export async function addOrder(data: CreateUpdateOrderInput): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export async function updateOrder(
  id: string,
  data: CreateUpdateOrderInput
): Promise<void> {
  const result = await Client.post<void>(`${resource}/${id}`, data);
  return result.data;
}
export async function deleteOrder(id: string): Promise<void> {
  const result = await Client.delete<void>(`${resource}/${id}`);
  return result.data;
}
