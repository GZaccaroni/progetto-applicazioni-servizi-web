import Client from "@/repositories/common/AxiosClient";
import { PaginatedResult } from "@common/model/common/PaginatedResult";
import { NetworkCustomer } from "@common/model/network/NetworkCustomer";
import { Cancellable } from "@/repositories/common/Cancellable";
import { observePaginatedResult } from "@/repositories/common/ObserveUtils";
import { CreateUpdateCustomerInput } from "@common/model/network/CreateUpdateCustomerInput";
import { FindCustomersInput } from "@common/model/network/FindCustomersInput";

const resource = "/customer";

export function observeCustomers(
  input: FindCustomersInput,
  onNext: (result: PaginatedResult<NetworkCustomer>) => void,
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
export async function findCustomers(
  input: FindCustomersInput
): Promise<PaginatedResult<NetworkCustomer>> {
  const result = await Client.get<PaginatedResult<NetworkCustomer>>(
    `${resource}/find`,
    {
      params: input,
    }
  );
  return result.data;
}
export async function findCustomer(id: string): Promise<NetworkCustomer> {
  const result = await Client.get<NetworkCustomer>(`${resource}/${id}`);
  return result.data;
}
export async function addCustomer(
  data: CreateUpdateCustomerInput
): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export async function updateCustomer(
  id: string,
  data: CreateUpdateCustomerInput
): Promise<void> {
  const result = await Client.post<void>(`${resource}/${id}`, data);
  return result.data;
}
export async function deleteCustomer(id: string): Promise<void> {
  const result = await Client.delete<void>(`${resource}/${id}`);
  return result.data;
}
