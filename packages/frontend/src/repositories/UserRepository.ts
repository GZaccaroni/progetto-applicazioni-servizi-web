import Client from "@/repositories/common/AxiosClient";
import { PaginatedResult } from "@common/model/common/PaginatedResult";
import { NetworkUser } from "@common/model/network/NetworkUser";
import { Cancellable } from "@/repositories/common/Cancellable";
import { observePaginatedResult } from "@/repositories/common/ObserveUtils";
import { NetworkIdentifiable } from "@common/model/network/NetworkIdentifiable";
import { PaginateParams } from "@common/model/network/PaginateParams";
const resource = "/user";

export function observeUsers(
  input: FindUsersInput,
  onNext: (result: PaginatedResult<NetworkUser>) => void,
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
export interface FindUsersInput extends PaginateParams {
  searchName?: string;
  limit: number;
}
export async function findUsers(
  input: FindUsersInput
): Promise<PaginatedResult<NetworkUser>> {
  const result = await Client.get<PaginatedResult<NetworkUser>>(
    `${resource}/find`,
    {
      params: input,
    }
  );
  return result.data;
}
export async function findUser(id: string): Promise<NetworkUser> {
  const result = await Client.get<NetworkUser>(`${resource}/${id}`);
  return result.data;
}
export async function findCurrentUser(): Promise<NetworkUser> {
  const result = await Client.get<NetworkUser>(`${resource}/me`);
  return result.data;
}
export type AddUserInput = Omit<NetworkUser, keyof NetworkIdentifiable> & {
  password: string;
};
export async function addUser(data: AddUserInput): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
export type UpdateUserInput = Omit<AddUserInput, "password"> & {
  password?: string;
};
export async function updateUser(
  username: string,
  item: UpdateUserInput
): Promise<void> {
  const result = await Client.post<void>(`${resource}/${username}`, item);

  return result.data;
}
export async function deleteUser(username: string): Promise<void> {
  const result = await Client.delete<void>(`${resource}/${username}`);
  return result.data;
}
