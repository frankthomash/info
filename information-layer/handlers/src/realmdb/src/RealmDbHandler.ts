import Realm from "realm";
import { v4 as uuidv4 } from "uuid";
import { HandlerBase } from "../../../../handlers/src/HandlerBase";
import {
  mediaElementsParams,
  databaseConfig,
  isDatabaseConfig
} from "../config/database-params";
import { realmConfig, SupportedDataPoints } from "../config/realm-config";
import {
  logMessage,
  logWithColor,
  MessageType,
  COLORS,
} from "../../../../utils/logger";
import { createErrorMessage } from "../../../../utils/error-message-helper";
import { WebSocket, Message } from "../../types";


// Define a type for changes
interface Changes {
  deleted: boolean;
  changedProperties: string[];
}

// Helper function to parse changes
function parseOnMediaElementChangeResponse(changes: Changes, mediaElement: any) {
  return changes.changedProperties.map((prop) => ({
    name: prop,
    value: mediaElement[prop],
  }));
}

export class RealmDBHandler extends HandlerBase {
  private realm: Realm | null;
  private _sendMessageToClients: ((ws: WebSocket, message: any) => void) | null;
  private listeners: Map<WebSocket, Map<string, any>>;

  constructor() {
    super();
    this.realm = null;
    this._sendMessageToClients = null;
    this.listeners = new Map();
  }

  async authenticateAndConnect(sendMessageToClients: (ws: WebSocket, message: any) => void): Promise<void> {
    try {
      this._sendMessageToClients = sendMessageToClients;

      if (!isDatabaseConfig(databaseConfig)) {
        throw new Error("Invalid database configuration.");
      }
      
      const app = new Realm.App({ id: databaseConfig.realmAppId });
      const credentials = Realm.Credentials.apiKey(databaseConfig.realmApiKey);
      const user = await app.logIn(credentials);
      console.info("Successfully authenticated to RealmDB");

      const supportedDataPoints = this._getSupportedDataPoints() as SupportedDataPoints;
      const realmConfigObj = realmConfig(user, supportedDataPoints);
      this.realm = await Realm.open(realmConfigObj);
      console.info("Connection established successfully");

      for (const [key, value] of Object.entries(mediaElementsParams)) {
        try {
          const databaseName = value.databaseName;
          await this.realm.objects(databaseName).subscribe();
          console.info(`Subscribed to the database ${key}: ${databaseName}`);
        } catch (error) {
          logMessage(`Error subscribing databases: ${error}`, MessageType.ERROR);
        }
      }
    } catch (error) {
      logMessage(`Failed to authenticate with Realm: ${error}`, MessageType.ERROR);
    }
  }

  async read(message: Message, ws: WebSocket): Promise<void> {
    if (this.#areNodesValid(message, ws)) {
      try {
        const updateMessage = await this.#getMessageData(message);
        this._sendMessageToClient(ws, updateMessage);
      } catch (error: any) {
        logMessage(`Error reading object from Realm: ${error.message}`, MessageType.ERROR);
        this._sendMessageToClient(ws, createErrorMessage("read", 404, JSON.parse(error.message)));
      }
    }
  }

  async write(message: Message, ws: WebSocket): Promise<void> {
    if (this.#areNodesValid(message, ws)) {
      try {
        const mediaElement = await this.#getMediaElement(message);
        const nodes = message.node ? [message.node] : message.nodes;

        const transformAndAssign = (element: any, nodes: any[]) => {
          nodes.forEach(({ name, value }) => {
            const prop = this._transformDataPointsWithUnderscores(name);
            element[prop] = value;
          });
        };

        this.realm?.write(() => {
          if (mediaElement) {
            transformAndAssign(mediaElement, nodes ?? []);
          } else {
            if (!message.tree || !mediaElementsParams[message.tree]) {
              const errorMessage = "Tree is undefined or does not exist in mediaElementsParams";
              logMessage(errorMessage, MessageType.ERROR);
              this._sendMessageToClient(ws, createErrorMessage("write", 404, errorMessage));
              return;
            }
                    
            const dataPointId = mediaElementsParams[message.tree].dataPointId;
            const document = { _id: uuidv4(), [dataPointId]: message.id };
            transformAndAssign(document, nodes ?? []);
            const databaseName = mediaElementsParams[message.tree].databaseName;
            this.realm?.create(databaseName, document);
          }
        });

        await this.read(message, ws);
      } catch (error: any) {
        const errorMessage = `Schema is not compatible for that media element: ${error.message}`;
        logMessage(errorMessage, MessageType.ERROR);
        this._sendMessageToClient(ws, createErrorMessage("write", 404, errorMessage));
      }
    }
  }

  async subscribe(message: Message, ws: WebSocket): Promise<void> {
    try {
      const mediaElement = await this.#getMediaElement(message);

      if (mediaElement) {
        const objectId = mediaElement._id;
        const { id, tree, uuid } = message;
        if (!id || !tree || !mediaElementsParams[tree]) {
          const errorMessage = "Tree or id is undefined or does not exist in mediaElementsParams";
          logMessage(errorMessage, MessageType.ERROR);
          this._sendMessageToClient(ws, createErrorMessage("write", 404, errorMessage));
          return;
        }

        const { databaseName, dataPointId } = mediaElementsParams[tree];

        if (!this.listeners.has(ws)) {
          this.listeners.set(ws, new Map());
        }

        if (!this.listeners.get(ws)?.has(id)) {
          logWithColor(
            `Subscribing element for user '${uuid}': Object ID: ${objectId} with ${dataPointId}: '${id}' on ${databaseName}`,
            COLORS.GREY
          );

          const listener = (mediaElement: any, changes: Changes) =>
            this.#onMediaElementChange(mediaElement, changes, { id, tree, uuid }, ws);

          mediaElement.addListener(listener);

          this.listeners.get(ws)?.set(id, {
            objectId: objectId,
            mediaElement: mediaElement,
            listener: listener,
          });

          this._sendMessageToClient(
            ws,
            this._createSubscribeMessage("subscribe", message, "succeed")
          );

          logWithColor(`Subscription added! Amount Clients: ${this.listeners.size}`, COLORS.GREY);
        } else {
          this._sendMessageToClient(ws, createErrorMessage("subscribe", 400, `Subscription already done to ${dataPointId}: '${id}'`));
        }
      } else {
        this._sendMessageToClient(ws, createErrorMessage("subscribe", 400, "Object not found"));
      }
    } catch (error) {
      this._sendMessageToClient(ws, createErrorMessage("subscribe", 503, "Subscription process could not finish, try again"));
    }
  }

  async unsubscribe(message: Message, ws: WebSocket): Promise<void> {
    const { id, tree, uuid } = message;
    if (!id || !tree || !mediaElementsParams[tree]) {
      const errorMessage = "Tree or id is undefined or does not exist in mediaElementsParams";
      logMessage(errorMessage, MessageType.ERROR);
      this._sendMessageToClient(ws, createErrorMessage("write", 404, errorMessage));
      return;
    }

    const { databaseName, dataPointId } = mediaElementsParams[tree];

    if (this.listeners.has(ws)) {
      const wsListeners = this.listeners.get(ws);
      if (wsListeners?.has(id)) {
        const listener = wsListeners.get(id);
        logWithColor(
          `Unsubscribing element for user '${uuid}': Object ID: ${listener.objectId} with ${dataPointId}: '${id}' on ${databaseName}`,
          COLORS.GREY
        );
        listener.mediaElement.removeListener(listener.listener);
        wsListeners.delete(id);

        if (wsListeners.size === 0) {
          this.listeners.delete(ws);
        }

        this._sendMessageToClient(ws, this._createSubscribeMessage("unsubscribe", message, "succeed"));
      } else {
        this._sendMessageToClient(ws, createErrorMessage("unsubscribe", 400, `No subscription found for VIN: ${id}`));
      }
    } else {
      this._sendMessageToClient(ws, createErrorMessage("unsubscribe", 400, `No subscription found for this client`));
    }
    logWithColor(`Subscription removed! Amount Clients: ${this.listeners.size}`, COLORS.GREY);
  }

  async unsubscribe_client(ws: WebSocket): Promise<void> {
    this.listeners.delete(ws);
    logWithColor(`All client subscriptions removed! Amount Clients: ${this.listeners.size}`, COLORS.GREY);
  }

  // Private methods

  #areNodesValid(message: Message, ws: WebSocket): boolean {
    const { type, tree } = message;
    if (!tree || !mediaElementsParams[tree]) {
      logMessage("Tree is undefined or does not exist in mediaElementsParams", MessageType.ERROR);
      return false;
    }

    const { databaseName } = mediaElementsParams[tree];

    const mediaElementSchema = this.realm?.schema.find(
      (schema) => schema.name === databaseName
    );

    const errorData = this._validateNodesAgainstSchema(message, mediaElementSchema?.properties ?? {});

    if (errorData) {
      logMessage(`Error validating message nodes against schema: ${JSON.stringify(errorData)}`, MessageType.ERROR);
      this._sendMessageToClient(ws, createErrorMessage(`${type}`, 404, errorData));
      return false;
    }
    return true;
  }

  async #getMessageData(message: Message): Promise<any> {
    const mediaElement = await this.#getMediaElement(message);

    if (!mediaElement) {
      throw new Error(`No data found with the Id: ${message.id}`);
    }

    logWithColor(`Media Element: \n ${JSON.stringify(mediaElement)}`, COLORS.GREY);

    const responseNodes = this.#parseReadResponse(message, mediaElement);
    return this._createUpdateMessage(message, responseNodes);
  }

  #parseReadResponse(message: Message, queryResponseObj: any): { name: string; value: any }[] {
    const data: { name: string; value: any }[] = [];
    const nodes = message.node ? [message.node] : message.nodes;
    nodes?.forEach((node: any) => {
        const prop = this._transformDataPointsWithUnderscores(node.name);
        data.push({
            name: node.name,
            value: queryResponseObj[prop],
        });
    });
    return data;
  }

  async #getMediaElement(message: Message): Promise<any> {
    try {
      const { id, tree } = message;
      if (!tree || !mediaElementsParams[tree]) {
        logMessage("Tree is undefined or does not exist in mediaElementsParams", MessageType.ERROR);
        return false;
      }
  
      const { databaseName, dataPointId } = mediaElementsParams[tree];
      return await this.realm?.objects(databaseName).filtered(`${dataPointId} = '${id}'`)[0];
    } catch (error: any) {
      logMessage(`Error trying to get media element from Realm: ${error.message}`, MessageType.ERROR);
    }
  }

  #onMediaElementChange(
    mediaElement: any, 
    changes: Changes, 
    messageHeader: Pick<Message, 'id' | 'tree' | 'uuid'>,
    ws: WebSocket): void {
    logMessage("Media element changed", MessageType.RECEIVED, `Web-Socket Connection Event Received`);
    if (changes.deleted) {
      logWithColor("MediaElement is deleted", COLORS.YELLOW);
    } else {
      if (changes.changedProperties.length > 0) {
        const responseNodes = parseOnMediaElementChangeResponse(changes, mediaElement);
        const updateMessage = this._createUpdateMessage(messageHeader, responseNodes);
        this._sendMessageToClient(ws, updateMessage);
      }
    }
  }
}
