import axios from "axios";
import AppConfig from "@/config/AppConfig";

const client = axios.create({
  baseURL: AppConfig.apiEndpoint,
  withCredentials: true,
});

export default client;
