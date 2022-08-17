import axios from "axios";
import AppConfig from "@/config/AppConfig";

const client = axios.create({
  baseURL: AppConfig.httpEndpoint,
  withCredentials: true,
});

export default client;
