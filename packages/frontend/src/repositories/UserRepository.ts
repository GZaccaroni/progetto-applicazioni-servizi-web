import Client from "@/repositories/common/AxiosClient";
import {
  PaginatedFindInput,
  PaginatedResult,
} from "@/repositories/common/PaginatedResult";
import { omit } from "lodash";
import { DbUser } from "@/model/db/DbUser";
import { Cancellable } from "@/repositories/common/Cancellable";
import { observePaginatedResult } from "@/repositories/common/ObserveUtils";
import { DbIdentifiable } from "@/model/db/DbIdentifiable";
import user from "@/store/user";

const resource = "/user";

export function observeUsers(
  input: FindUsersInput,
  onNext: (result: PaginatedResult<DbUser>) => void,
  onError: (error: { code: string; message: string }) => void
): Cancellable {
  return observePaginatedResult(
    input,
    findUsers,
    "userChanged",
    onNext,
    onError
  );
}
export interface FindUsersInput extends PaginatedFindInput {
  searchName?: string;
  limit: number;
}
export async function findUsers(
  input: FindUsersInput
): Promise<PaginatedResult<DbUser>> {
  const result = await Client.get<PaginatedResult<DbUser>>(`${resource}/find`, {
    params: input,
  });
  return result.data;
}
export async function findUser(id: string): Promise<DbUser> {
  const result = await Client.get<DbUser>(`${resource}/${id}`);
  return result.data;
}
export type AddUserInput = Omit<DbUser, keyof DbIdentifiable> & {
  password: string;
};
export async function addUser(data: AddUserInput): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export type UpdateUserInput = Omit<AddUserInput, "password"> & {
  password?: string;
} & DbIdentifiable;
export async function updateUser(item: UpdateUserInput): Promise<void> {
  const result = await Client.post<void>(
    `${resource}/${item.username}`,
    omit(item, "id")
  );
  return result.data;
}
export async function deleteUser(id: string): Promise<void> {
  const result = await Client.delete<void>(`${resource}/${id}`);
  return result.data;
}
