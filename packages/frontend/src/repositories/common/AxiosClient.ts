import axios from "axios";
import { deserializeDates } from "@/repositories/common/Deserializer";
import AppConfig from "@/config/AppConfig";

const client = axios.create({
  baseURL: AppConfig.httpEndpoint,
  withCredentials: true,
});
client.interceptors.response.use((originalResponse) => {
  deserializeDates(originalResponse.data);
  return originalResponse;
});

export default client;
