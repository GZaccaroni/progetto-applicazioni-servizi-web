import { AppConfig } from "@/config/AppConfig";

const config: AppConfig = {
  apiEndpoint: process.env.API_ENDPOINT || "http://localhost:3000",
  socketIoEndpoint: process.env.SOCKETIO_ENDPOINT || "http://localhost:3000/",
};

export default config;
