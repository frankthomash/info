import { Message, WebSocket } from "./types";

export interface IHandler {
  authenticateAndConnect(sendMessageToClients: (message: any) => void): void;
  read(message: Message, ws: WebSocket): void;
  write(message: Message, ws: WebSocket): void;
  subscribe(message: Message, ws: WebSocket): void;
  unsubscribe(message: Message, ws: WebSocket): void;
  unsubscribe_client(ws: WebSocket): void;
}