import { io, Socket } from "socket.io-client";
const domain = "https://socketiodomain/";
export interface ServerToClientEvents {
  orderChanged: (id: string) => void;
  itemChanged: (id: string) => void;
  storeChanged: (id: string) => void;
  userChanged: (id: string) => void;
  customerChanged: (id: string) => void;
}

export type ClientToServerEvents = Record<string, never>;

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(domain);

export default socket;
