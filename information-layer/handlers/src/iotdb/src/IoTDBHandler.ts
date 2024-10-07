import { SupportedMessageDataTypes } from './../utils/iotdb-constants';
import { Client as ThriftClient } from "../gen-nodejs/IClientRPCService";
import {
  TSExecuteStatementReq,
  TSOpenSessionReq,
  TSProtocolVersion,
  TSCloseSessionReq,
  TSInsertRecordReq,
} from "../gen-nodejs/IClientRPCService_types";
import thrift from "thrift";
import { MyInt64 } from "./Int64";
import { HandlerBase } from "../../HandlerBase";
import { SessionDataSet } from "../utils/SessionDataSet";
import { IoTDBDataInterpreter } from "../utils/IoTDBDataInterpreter";
import { createDataPointsSchema, isSupportedDataPoint, SupportedDataPoints } from "../config/DataPointsSchema";
import { databaseParams, databaseConfig } from "../config/database-params";
import { logMessage, logWithColor, MessageType, COLORS } from "../../../../utils/logger";
import { createErrorMessage } from "../../../../utils/error-message-helper";
import { WebSocket, Message } from "../../types";

export class IoTDBHandler extends HandlerBase {
  private client: ThriftClient | null;
  private _sendMessageToClients: ((ws: WebSocket, message: any) => void) | null;
  private sessionId: string | null;
  private protocolVersion: number;
  private statementId: string | null;
  private zoneId: string;
  private fetchSize: number;
  private isSessionClosed: boolean;
  private dataPointsSchema: any;

  constructor() {
    super();
    this.client = null;
    this._sendMessageToClients = null;
    this.sessionId = null;
    this.protocolVersion = TSProtocolVersion.IOTDB_SERVICE_PROTOCOL_V3;
    this.statementId = null;
    this.zoneId = databaseConfig.timeZoneId ?? "UTC";
    this.fetchSize = databaseConfig.fetchSize ?? 10000;
    this.isSessionClosed = true;
    this.dataPointsSchema = null;
  }

  async authenticateAndConnect(sendMessageToClients: (ws: WebSocket, message: any) => void): Promise<void> {
    try {
      this._sendMessageToClients = sendMessageToClients;

      const connection = thrift.createConnection(
        databaseConfig.iotdbHost,
        databaseConfig.iotdbPort ?? 6667,
        {
          transport: thrift.TFramedTransport,
          protocol: thrift.TBinaryProtocol,
        }
      );

      this.client = thrift.createClient(ThriftClient, connection);

      connection.on("error", (error) => {
        logMessage("thrift connection error: ".concat(error), MessageType.ERROR);
      });

      const supportedDataPoint : SupportedDataPoints = this._getSupportedDataPoints() as SupportedDataPoints;
      this.dataPointsSchema = createDataPointsSchema(supportedDataPoint);

      console.info("Successfully connected to IoTDB using thrift");
    } catch (error) {
      logMessage("Failed to authenticate with IoTDB: ".concat((error as Error).message), MessageType.ERROR);
    }
  }

  async read(message: Message, ws: WebSocket): Promise<void> {
    if (this.areNodesValid(message, ws)) {
      try {
        await this.openSessionIfNeeded();
        const responseNodes = await this.queryLastFields(message, ws);
        if (responseNodes.length > 0) {
          const responseMessage = this._createUpdateMessage(message, responseNodes);
          this._sendMessageToClient(ws, responseMessage);
        } else {
          this._sendMessageToClient(
            ws,
            createErrorMessage("read", 404, `No data found with the Id: ${message.id}`)
          );
        }
      } catch (error: any) {
        this._sendMessageToClient(ws, createErrorMessage("read", 404, error.message));
      } finally {
        await this.closeSessionIfNeeded();
      }
    }
  }

  async write(message: Message, ws: WebSocket): Promise<void> {
    if (this.areNodesValid(message, ws)) {
      try {
        await this.openSessionIfNeeded();
        const data = this.createObjectToInsert(message);
        let measurements: string[] = [];
        let dataTypes: string[] = [];
        let values: any[] = [];

        for (const [key, value] of Object.entries(data)) {
          measurements.push(key);
          dataTypes.push(this.dataPointsSchema[key]);
          values.push(value);
        }

        const tree = message.tree as keyof typeof databaseParams;
        if (!tree || !databaseParams[tree]) {
          throw new Error(`Invalid tree specified: ${message.tree}`);
        }

        const timestamp = Date.now();
        const deviceId = databaseParams[tree].databaseName;
        const status = await this.insertRecord(deviceId, timestamp, measurements, dataTypes, values);

        logWithColor(
          `Record inserted to device ${deviceId}, status code: `.concat(JSON.stringify(status)),
          COLORS.GREY
        );

        const responseNodes = await this.queryLastFields(message, ws);

        if (responseNodes.length) {
          const responseMessage = this._createUpdateMessage(message, responseNodes);
          this._sendMessageToClient(ws, responseMessage);
        } else {
          this._sendMessageToClient(
            ws,
            createErrorMessage("write", 404, `No data found with the Id: ${message.id}`)
          );
        }
      } catch (error: any) {
        this._sendMessageToClient(ws, createErrorMessage("write", 503, `Failed writing data. ${error}`));
      } finally {
        await this.closeSessionIfNeeded();
      }
    }
  }

  private async openSession(): Promise<void> {
    if (!this.isSessionClosed) {
      console.info("The session is already opened.");
      return;
    }

    const openSessionReq = new TSOpenSessionReq({
      username: databaseConfig.iotdbUser,
      password: databaseConfig.iotdbPassword,
      client_protocol: this.protocolVersion,
      zoneId: databaseConfig.timeZoneId,
      configuration: new Map<string, string>([['version', 'V_0_13']])    
    });

    try {
      const resp = await this.client?.openSession(openSessionReq);

      if (this.protocolVersion !== resp.serverProtocolVersion) {
        console.info(
          "Protocol differ, Client version is " +
            this.protocolVersion +
            ", but Server version is " +
            resp.serverProtocolVersion
        );
        // version is less than 0.10
        if (resp.serverProtocolVersion === 0) {
          throw new Error("Protocol not supported.");
        }
      }

      this.sessionId = resp.sessionId;
      if (this.sessionId) {
        const sessionIdInt64 = new MyInt64(this.sessionId);
        const statementId = await this.client?.requestStatementId(sessionIdInt64);
        this.statementId = statementId ? statementId.toString() : null;
      } else {
        throw new Error("Session ID is null, cannot request statement ID.");
      }  
      this.isSessionClosed = false;
      console.info("Session started!");
    } catch (error: any) {
      logMessage("Failed starting session with IoTDB: ".concat(error), MessageType.ERROR);
    }
  }

  private closeSession(): void {
    if (this.isSessionClosed) {
      console.info("Session is already closed.");
      return;
    }

    const sessionIdInt64 = new MyInt64(this.sessionId!);
    const req = new TSCloseSessionReq({ sessionId: sessionIdInt64 });

    try {
      this.client?.closeSession(req);
    } catch (error: any) {
      logMessage(
        "Error occurs when closing session at server. Maybe server is down. Error message: ".concat(error),
        MessageType.ERROR
      );
    } finally {
      this.isSessionClosed = true;
      console.info("Session closed!");
    }
  }

  private async openSessionIfNeeded(): Promise<void> {
    if (this.isSessionClosed) {
      await this.openSession();
    }
  }

  private async closeSessionIfNeeded(): Promise<void> {
    if (!this.isSessionClosed) {
      this.closeSession();
    }
  }

  private areNodesValid(message: Message, ws: WebSocket): boolean {
    const { type } = message;

    const errorData = this._validateNodesAgainstSchema(message, this.dataPointsSchema);

    if (errorData) {
      logMessage(`Error validating message nodes against schema: ${JSON.stringify(errorData)}`, MessageType.ERROR);
      this._sendMessageToClient(ws, createErrorMessage(`${type}`, 404, errorData));

      return false;
    }
    return true;
  }

  private async queryLastFields(message: Message, ws: WebSocket): Promise<Array<{ name: string; value: any }>> {
    const { id: objectId, tree } = message;

    if (!tree || !(tree in databaseParams)) {
      const errorMsg = `Invalid or undefined tree provided: ${tree}`;
      logMessage(errorMsg, MessageType.ERROR);
      this._sendMessageToClient(ws, createErrorMessage("read", 404, errorMsg));
      return [];
    }
    const { databaseName, dataPointId } = databaseParams[tree as keyof typeof databaseParams];
    const fieldsToSearch = this.extractDataPointsFromNodes(message).join(", ");
    const sql = `SELECT ${fieldsToSearch} FROM ${databaseName} WHERE ${dataPointId} = '${objectId}' ORDER BY Time ASC`;

    try {
      const sessionDataSet = await this.executeQueryStatement(sql);

      // Check if sessionDataSet is not an instance of SessionDataSet, and handle the error
      if (!(sessionDataSet instanceof SessionDataSet)) {
          throw new Error("Failed to retrieve session data. Invalid session dataset.");
      }

      const mediaElements: any[] = [];
      while (sessionDataSet.hasNext()) {
        mediaElements.push(sessionDataSet.next());
      }

      const latestValues: Record<string, any> = {};
      mediaElements.forEach((mediaElement) => {
        const transformedMediaElement = Object.fromEntries(
          Object.entries(mediaElement).map(([key, value]) => {
            const newKey = this._transformDataPointsWithDots(key);
            return [newKey, value];
          })
        );

        const transformedObject = IoTDBDataInterpreter.extractNodesFromTimeseries(transformedMediaElement, databaseName);

        Object.entries(transformedObject).forEach(([key, value]) => {
          if (value !== null && !isNaN(value)) {
            latestValues[key] = value;
          }
        });
      });

      return Object.entries(latestValues).map(([name, value]) => ({ name, value }));

    } catch (error: any) {
      this._sendMessageToClient(ws, createErrorMessage("read", 503, error.message));
      return [];
    }
  }

  private async executeQueryStatement(sql: string): Promise<SessionDataSet | {}> {
    try {
      if (!this.sessionId) {
        throw new Error("Session is not open. Please authenticate first.");
      }

      const request = new TSExecuteStatementReq({
        sessionId: new MyInt64(this.sessionId),
        statement: sql,
        statementId: new MyInt64(this.statementId!),
        fetchSize: this.fetchSize,
        timeout: 0,
      });

      const resp = await this.client?.executeQueryStatement(request);
      if (!resp || !resp.queryDataSet || !resp.queryDataSet.valueList) {
        return {};
      } else {
        return new SessionDataSet(
          resp.columns,
          resp.dataTypeList,
          resp.columnNameIndexMap,
          resp.queryId,
          this.client!,
          this.statementId!,
          this.sessionId!,
          resp.queryDataSet,
          resp.ignoreTimeStamp
        );
      }
    } catch (error: any) {
      logMessage("Failed executing query statement: ".concat(error), MessageType.ERROR);
      return {};
    }
  }

  private async insertRecord(
    deviceId: string,
    timestamp: number,
    measurements: string[],
    dataTypes: string[],
    values: any[],
    isAligned = false
  ): Promise<any> {
    if (values.length !== dataTypes.length || values.length !== measurements.length) {
      throw "length of data types does not equal to length of values!";
    }

    // Validate the dataTypes before using them
    const validatedDataTypes: (keyof typeof SupportedMessageDataTypes)[] = [];
    
    dataTypes.forEach((dataType) => {
      if (isSupportedDataPoint(dataType)) {
        validatedDataTypes.push(dataType);  // Add valid data types
      } else {
        throw new Error(`Unsupported data type: ${dataType}`);
      }
    });

    const valuesInBytes = IoTDBDataInterpreter.serializeValues(validatedDataTypes, values);

    const request = new TSInsertRecordReq({
      sessionId: new MyInt64(this.sessionId!),
      prefixPath: deviceId,
      measurements: measurements,
      values: valuesInBytes,
      timestamp: new MyInt64(timestamp),
      isAligned: isAligned,
    });

    return await this.client?.insertRecord(request);
  }

  private extractDataPointsFromNodes(message: Message): string[] {
    let dataPoints: string[] = [];

    if (message.node) {
      dataPoints.push(this._transformDataPointsWithUnderscores(message.node.name));
    } else if (message.nodes) {
      dataPoints = message.nodes.map((node) => this._transformDataPointsWithUnderscores(node.name));
    }
    return dataPoints;
  }

  private createObjectToInsert(message: Message): Record<string, any> {
    const { id, tree } = message;

    if (!tree || !(tree in databaseParams)) {
      throw new Error(`Invalid or undefined tree provided: ${tree}`);
    }
    const { dataPointId } = databaseParams[tree as keyof typeof databaseParams];
    const data: Record<string, any> = { [dataPointId]: id };

    if (message.node) {
      data[this._transformDataPointsWithUnderscores(message.node.name)] = message.node.value;
    } else if (message.nodes) {
      message.nodes.forEach((node) => {
        data[this._transformDataPointsWithUnderscores(node.name)] = node.value;
      });
    }
    return data;
  }
}

export default IoTDBHandler;
