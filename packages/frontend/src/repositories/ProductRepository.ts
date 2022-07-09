import Client from "@/repositories/common/AxiosClient";
import {
  PaginatedFindInput,
  PaginatedResult,
} from "@/repositories/common/PaginatedResult";
import { omit } from "lodash";
import { DbProduct } from "@/model/db/DbProduct";
import { Cancellable } from "@/repositories/common/Cancellable";
import { observePaginatedResult } from "@/repositories/common/ObserveUtils";
import { DbIdentifiable } from "@/model/db/DbIdentifiable";

const resource = "/product";

export interface FindProductsInput extends PaginatedFindInput {
  searchName?: string;
  limit: number;
}
export function observeProducts(
  input: FindProductsInput,
  onNext: (result: PaginatedResult<DbProduct>) => void,
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
): Promise<PaginatedResult<DbProduct>> {
  const result = await Client.get<PaginatedResult<DbProduct>>(
    `${resource}/find`,
    {
      params: input,
    }
  );
  return result.data;
}
export async function findProduct(id: string): Promise<DbProduct> {
  const result = await Client.get<DbProduct>(`${resource}/${id}`);
  return result.data;
}
export async function addProduct(
  data: Omit<DbProduct, keyof DbIdentifiable>
): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export async function updateProduct(item: DbProduct): Promise<void> {
  const result = await Client.post<void>(
    `${resource}/${item.id}`,
    omit(item, "id")
  );
  return result.data;
}
export async function deleteProduct(id: string): Promise<void> {
  const result = await Client.delete<void>(`${resource}/${id}`);
  return result.data;
}