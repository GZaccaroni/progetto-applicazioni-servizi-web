import { io, Socket } from "socket.io-client";
import AppConfig from "@/config/AppConfig";

const domain = AppConfig.socketIoEndpoint;

export interface ServerToClientEvents {
  orderChanged: (data: ServerEventData) => void;
  productChanged: (data: ServerEventData) => void;
  storeChanged: (data: ServerEventData) => void;
  userChanged: (data: ServerEventData) => void;
  customerChanged: (data: ServerEventData) => void;
}
export interface ServerEventData {
  id: string;
  action: ServerEventAction;
}
export enum ServerEventAction {
  create = "create",
  update = "update",
  delete = "delete",
}

export type ClientToServerEvents = Record<string, never>;

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(domain, {
  withCredentials: true,
});
export default socket;
