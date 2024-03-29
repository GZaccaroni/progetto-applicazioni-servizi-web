import Client from "@/repositories/common/AxiosClient";
import { PaginatedResult } from "@common/model/common/PaginatedResult";
import { NetworkUser } from "@common/model/network/NetworkUser";
import { Cancellable } from "@/repositories/common/Cancellable";
import { observePaginatedResult } from "@/repositories/common/ObserveUtils";
import { PaginateParams } from "@common/model/network/PaginateParams";
import { UpdateUserInput } from "@common/model/network/UpdateUserInput";
import { CreateUserInput } from "@common/model/network/CreateUserInput";
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
export async function addUser(data: CreateUserInput): Promise<void> {
  const result = await Client.post<void>(`${resource}`, data);
  return result.data;
}
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
