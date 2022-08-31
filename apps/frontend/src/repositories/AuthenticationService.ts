import Client from "@/repositories/common/AxiosClient";

const resource = "/user";

export async function login(username: string, password: string): Promise<void> {
  const result = await Client.post<void>(`${resource}/login`, {
    username: username,
    password: password,
  });
  return result.data;
}
export async function logout(): Promise<void> {
  const result = await Client.post<void>(`${resource}/logout`);
  return result.data;
}
