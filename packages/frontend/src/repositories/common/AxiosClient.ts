import axios from "axios";
import { deserializeDates } from "@/repositories/common/Deserializer";

const baseDomain =
  "https://virtserver.swaggerhub.com/ZACCARONIGIULIO/ColtureCloud/1.0.0";
const baseURL = `${baseDomain}`;

const client = axios.create({
  baseURL,
  headers: {
    // "Authorization": "Bearer xxxxx"
  },
});
client.interceptors.response.use((originalResponse) => {
  deserializeDates(originalResponse.data);
  return originalResponse;
});

export default client;
