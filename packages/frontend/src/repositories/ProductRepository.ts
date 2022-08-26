import Client from "@/repositories/common/AxiosClient";
import { PaginatedResult } from "@common/model/common/PaginatedResult";
import { NetworkProduct } from "@common/model/network/NetworkProduct";
import { Cancellable } from "@/repositories/common/Cancellable";
import { observePaginatedResult } from "@/repositories/common/ObserveUtils";
import { CreateUpdateProductInput } from "@common/model/network/CreateUpdateProductInput";
import { PaginateParams } from "@common/model/network/PaginateParams";

const resource = "/product";

export interface FindProductsInput extends PaginateParams {
  searchName?: string;
  limit: number;
}
export function observeProducts(
  input: FindProductsInput,
  onNext: (result: PaginatedResult<NetworkProduct>) => void,
  onError: (error: { code: string; message: string }) => void
): Cancellable {
  return observePaginatedResult(
    input,
    findProducts,
    "productChanged",
    onNext,
    onError
  );
}
export async function findProducts(
  input: FindProductsInput
): Promise<PaginatedResult<NetworkProduct>> {
  const result = await Client.get<PaginatedResult<NetworkProduct>>(
    `${resource}/find`,
    {
      params: input,
    }
  );
  return result.data;
}
export async function findProduct(id: string): Promise<NetworkProduct> {
  const result = await Client.get<NetworkProduct>(`${resource}/${id}`);
  return result.data;
}
export async function addProduct(
  data: CreateUpdateProductInput
): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export async function updateProduct(
  id: string,
  data: CreateUpdateProductInput
): Promise<void> {
  const result = await Client.post<void>(`${resource}/${id}`, data);
  return result.data;
}
export async function deleteProduct(id: string): Promise<void> {
  const result = await Client.delete<void>(`${resource}/${id}`);
  return result.data;
}
