import DevelopmentAppConfig from "@/config/DevelopmentAppConfig";
import ProductionAppConfig from "@/config/ProductionAppConfig";

export interface AppConfig {
  apiEndpoint: string;
  socketIoEndpoint: string;
}

const fallbackConfig = DevelopmentAppConfig;

function loadAppConfig(mode: string): AppConfig {
  switch (mode) {
    case "production":
      return ProductionAppConfig;
    case "development":
      return DevelopmentAppConfig;
    default:
      console.error(`Config missing for mode=${mode}, using fallback config `);
      return fallbackConfig;
  }
}

const mode = process.env.NODE_ENV;

export default loadAppConfig(mode);
