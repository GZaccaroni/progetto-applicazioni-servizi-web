import Client from "@/repositories/common/AxiosClient";
import { PaginatedResult } from "@/repositories/common/PaginatedResult";
import { omit } from "lodash";
import { DbStore } from "@/model/DbStore";
import { DbUser } from "@/model/DbUser";

const resource = "/user";

export interface FindStoresInput {
  authorized?: boolean;
  pagingNext?: string;
  pagingPrevious?: string;
  searchName?: string;
  limit: number;
}
export async function findUsers(
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
export async function findUser(id: string): Promise<DbStore> {
  const result = await Client.get<DbStore>(`${resource}/${id}`);
  return result.data;
}
export type AddUserInput = DbUser & { password: string };
export async function addUser(data: AddUserInput): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export type UpdateUserInput = {
  password?: string;
  isAdmin?: string;
};
export async function updateUser(item: UpdateUserInput): Promise<void> {
  const result = await Client.post<void>(
    `${resource}/${item.password}`,
    omit(item, "username")
  );
  return result.data;
}
export async function deleteUser(id: string): Promise<void> {
  const result = await Client.delete<void>(`${resource}/${id}`);
  return result.data;
}
