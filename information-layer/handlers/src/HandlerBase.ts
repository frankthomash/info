import fs from "fs";
import yaml from "js-yaml";
import { Message, WebSocket, DataPointSchema } from "./types";
import { getDataPointsPath } from "../config/config";
import { logMessage, MessageType } from "../../utils/logger";
import { IHandler } from "./IHandler";

export abstract class HandlerBase implements IHandler {

  // Default implementations of required functions
  authenticateAndConnect(sendMessageToClients: (message: any) => void): void {
    logMessage("authenticateAndConnect() is not implemented", MessageType.ERROR);
  }

  read(message: Message, ws: WebSocket): void {
    logMessage("read() is not implemented", MessageType.ERROR);
  }

  write(message: Message, ws: WebSocket): void {
    logMessage("write() is not implemented", MessageType.ERROR);
  }

  subscribe(message: Message, ws: WebSocket): void {
    logMessage("subscribe() is not implemented", MessageType.ERROR);
  }

  unsubscribe(message: Message, ws: WebSocket): void {
    logMessage("unsubscribe() is not implemented", MessageType.ERROR);
  }

  unsubscribe_client(ws: WebSocket): void {
    logMessage("unsubscribe_client() is not implemented", MessageType.ERROR);
  }

  handleMessage(message: Message, ws: WebSocket): void {
    try {
      switch (message.type) {
        case 'read':
          this.read(message, ws);
          break;
        case 'write':
          this.write(message, ws);
          break;
        case 'subscribe':
          this.subscribe(message, ws);
          break;
        case 'unsubscribe':
          this.unsubscribe(message, ws);
          break;
        default:
          ws.send(JSON.stringify({ error: 'Unknown message type' }));
      }
    } catch (error: any) {  // Use `any` for the `error` type for now
      ws.send(JSON.stringify({ error: error.message || 'An error occurred' }));
    }
  }

  /**
   * Sends a message to the client.
   */
  _sendMessageToClient(ws: WebSocket, message: object): void {
    logMessage(JSON.stringify(message), MessageType.SENT);
    ws.send(JSON.stringify(message));
  }

  /**
   * Creates an update message based on the nodes.
   */
  _createUpdateMessage(
    message: Pick<Message, 'id' | 'tree' | 'uuid'>,
    nodes: Array<{ name: string; value: any }>
  ): object {
    const { id, tree, uuid } = message;
    const newMessage: any = {
      type: "update",
      tree,
      id,
      dateTime: new Date().toISOString(),
      uuid,
    };
    if (nodes.length === 1) {
      newMessage["node"] = nodes[0];
    } else {
      newMessage["nodes"] = nodes;
    }
    return newMessage;
  }

  /**
   * Generic function to create or remove a subscription message.
   */
  _createSubscribeMessage(
    type: "subscribe" | "unsubscribe",
    message: Pick<Message, 'id' | 'tree' | 'uuid'>,
    status: string
  ): object {
    const { id, tree, uuid } = message;
    return {
      type: `${type}:status`,
      tree,
      id,
      dateTime: new Date().toISOString(),
      uuid,
      status: status,
    };
  }

  /**
   * Transforms a message node by replacing dots with underscores.
   */
  _transformDataPointsWithUnderscores(node: string): string {
    return node.replace(/\./g, "_");
  }

  /**
   * Transforms a database field name by replacing underscores with dots.
   */
  _transformDataPointsWithDots(field: string): string {
    return field.replace(/\_/g, ".");
  }

  /**
   * Reads and parses a data points file in either JSON, YML, or YAML format.
   */
  readDataPointsFile(filePath: string): object {
    const fileContent = fs.readFileSync(filePath, "utf8");
    if (filePath.endsWith(".json")) {
      return JSON.parse(fileContent);
    } else if (filePath.endsWith(".yaml") || filePath.endsWith(".yml")) {
      const result = yaml.load(fileContent);
      if (typeof result === "object" && result !== null) {
        return result;
      } else {
        throw new Error("YAML content is not a valid object");
      }
    } else {
      throw new Error("Unsupported data points file format");
    }
  }

  /**
   * Extracts data types from a data point object.
   */
  extractDataTypes(
    dataPointsObj: any,
    parentKey = "",
    result: { [key: string]: any } = {}
  ): { [key: string]: any } {
    for (const key in dataPointsObj) {
      if (dataPointsObj.hasOwnProperty(key)) {
        const value = dataPointsObj[key];
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (value && typeof value === "object") {
          if (value.datatype) {
            result[newKey] = value.datatype;
          } else {
            this.extractDataTypes(value.children || value, newKey, result);
          }
        }
      }
    }
    return result;
  }

  /**
   * Retrieves and processes supported data points.
   */
  _getSupportedDataPoints(): object {
    const datapointPath = getDataPointsPath();
    const dataPointObj = this.readDataPointsFile(datapointPath);
    const supportedDataPoints = this.extractDataTypes(dataPointObj);
    const result: { [key: string]: any } = {};
    Object.entries(supportedDataPoints).forEach(([node, value]) => {
      const underscored_node = this._transformDataPointsWithUnderscores(node);
      if (value !== null) {
        result[underscored_node] = value;
      }
    });
    return result;
  }

  /**
   * Validates nodes against a schema.
   */
  _validateNodesAgainstSchema(
    message: Message,
    dataPointsSchema: DataPointSchema
  ): object | null {
    const nodes = message.node ? [message.node] : message.nodes || [];

    const unknownFields = nodes.filter(({ name }) => {
      const transformedName = this._transformDataPointsWithUnderscores(name);
      return !dataPointsSchema.hasOwnProperty(transformedName);
    });

    if (unknownFields.length > 0) {
      const errors = unknownFields.map(({ name }) => ({
        name,
        status: "Parent object or node not found.",
      }));
      return errors.length === 1 ? { node: errors[0] } : { nodes: errors };
    }
    return null;
  }
}
