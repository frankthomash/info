import WebSocket, { WebSocketServer, RawData } from "ws";
import { RealmDBHandler } from "../../handlers/src/realmdb/src/RealmDbHandler";
import { IoTDBHandler } from "../../handlers/src/iotdb/src/IoTDBHandler";
import { HandlerBase } from "../../handlers/src/HandlerBase";
import { getHandlerType } from "../config/config";
import { validateMessage } from "../utils/message-validator";
import {
  logMessage,
  logWithColor,
  MessageType,
  COLORS,
} from "../../utils/logger";
import { Message, isMessage } from "../../handlers/src/types";

// Define the handler as the base class type
let handler: HandlerBase;

const handlerType: string = getHandlerType();

logWithColor(`\n ** Handler: ${handlerType} ** \n`, COLORS.BOLD);

// Instantiate the correct handler based on the handler type
switch (handlerType) {
  case "realmdb":
    handler = new RealmDBHandler();
    break;
  case "iotdb":
    handler = new IoTDBHandler();
    break;
  default:
    throw new Error("Unsupported handler type");
}

// WebSocket server creation
const server = new WebSocketServer({ port: 8080 });

// Define clients array globally to store connected clients
let clients: WebSocket[] = [];

// Handle new client connections
server.on("connection", (ws: WebSocket) => {
  logWithColor("* Client connected *", COLORS.YELLOW);
  clients.push(ws); // Add client to the array

  // Handle messages from the client
  ws.on("message", (message: WebSocket.RawData) => {
    const messageString = rawDataToString(message);
    logMessage(messageString, MessageType.RECEIVED);   
    const validatedMessage = validateMessage(messageString);

    // Ensure `validatedMessage` is either an instance of `Error` or of type `Message`
    if (validatedMessage instanceof Error) {
      logMessage(
        `Invalid message format: ${validatedMessage.message}`,
        MessageType.ERROR
      );

      JSON.parse(validatedMessage.message).forEach((error: any) => {
        ws.send(JSON.stringify(error));
      });
    } else if (isMessage(validatedMessage)) {
      // Pass the validated message to the handler
      handler.handleMessage(validatedMessage, ws);
    } else {
      logMessage("Unknown message type received.", MessageType.ERROR);
    }
  });

  // Handle client disconnection
  ws.on("close", () => {
    handler.unsubscribe_client(ws); // Remove all client listeners
    clients = clients.filter((client) => client !== ws); // Remove client from array
    console.info("* Client disconnected *");
  });
});

// Function to broadcast messages to all connected clients
const sendMessageToClients = (message: Message) => {
  logMessage(JSON.stringify(message), MessageType.SENT);
  clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
};

// Initialize handler and authenticate
console.info(`Starting authentication and connection ...`);
handler.authenticateAndConnect(sendMessageToClients);

// Log server start
logWithColor(`Web-Socket server started on ws://localhost:8080\n`, COLORS.BOLD);

function rawDataToString(message: RawData): string {
    if (typeof message === "string") {
      return message;
    } else if (Buffer.isBuffer(message)) {
      return message.toString();
    } else if (message instanceof ArrayBuffer) {
      return new TextDecoder().decode(message);
    } else {
      throw new Error("Unsupported message type");
    }
  }
  
