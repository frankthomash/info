import { IoTDBDataType } from "./iotdb-constants";

export class IoTDBRpcDataSet {
  // Static properties
  static TIMESTAMP_STR = "Time";
  static START_INDEX = 2;
  static FLAG = 0x80;

  // Private fields
  #sql: string | null = null;
  #columnNameList: string[];
  #columnTypeList: IoTDBDataType[];
  #queryId: number;
  #client: any;
  #statementId: number;
  #sessionId: number;
  #queryDataSet: any;
  #ignoreTimestamp: boolean;
  #fetchSize: number;
  #columnOrdinalDict: Map<string, number>;
  #columnTypeDeduplicatedList: (IoTDBDataType | null)[];
  #timeBytes: Buffer;
  #currentBitmap: Buffer[];
  #hasCachedRecord: boolean;
  #value: (Buffer | null)[];
  #emptyResultSet: boolean;
  #rowsIndex: number;
  #columnSize: number;

  constructor(
    columnNameList: string[],
    columnTypeList: IoTDBDataType[],
    columnNameIndex: { [key: string]: number } | null,
    queryId: number,
    client: any,
    statementId: number,
    sessionId: number,
    queryDataSet: any,
    ignoreTimestamp: boolean,
    fetchSize: number,
  ) {
    this.#columnNameList = [];
    this.#columnTypeList = [];
    this.#queryId = queryId;
    this.#client = client;
    this.#statementId = statementId;
    this.#sessionId = sessionId;
    this.#queryDataSet = queryDataSet;
    this.#ignoreTimestamp = ignoreTimestamp;
    this.#fetchSize = fetchSize;
    this.#columnSize = columnNameList.length;
    this.#columnOrdinalDict = new Map();
    this.#columnTypeDeduplicatedList = [];
    this.#hasCachedRecord = false;
    this.#emptyResultSet = false;
    this.#rowsIndex = 0;

    if (!ignoreTimestamp) {
      this.#columnNameList.push(IoTDBRpcDataSet.TIMESTAMP_STR);
      this.#columnTypeList.push(IoTDBDataType.INT64);
      this.#columnOrdinalDict.set(IoTDBRpcDataSet.TIMESTAMP_STR, 1);
    }

    if (columnNameIndex !== null) {
      for (let j = 0; j < columnNameIndex.length; j++) {
        this.#columnTypeDeduplicatedList.push(null);
      }

      for (let i = 0; i < columnNameList.length; i++) {
        const name = columnNameList[i];
        this.#columnNameList.push(name);
        this.#columnTypeList.push(columnTypeList[i]);
        if (!this.#columnOrdinalDict.has(name)) {
          const index = columnNameIndex[name];
          this.#columnOrdinalDict.set(name, index + IoTDBRpcDataSet.START_INDEX);
          this.#columnTypeDeduplicatedList[index] = columnTypeList[i];
        }
      }
    }

    this.#timeBytes = Buffer.alloc(0);
    this.#currentBitmap = Array(this.#columnTypeDeduplicatedList.length).fill(Buffer.alloc(0));
    this.#value = Array(this.#columnTypeDeduplicatedList.length).fill(null);
  }

  next(): boolean {
    if (this.#hasCachedResult()) {
      this.#constructOneRow();
      return true;
    }
    if (this.#emptyResultSet) {
      return true;
    }
    this.#fetchResults(); 
    if (this.#hasCachedResult()) {
        this.#constructOneRow();
        return true;
    }
    return false;
  }

  getHasCachedRecord(): boolean {
    return this.#hasCachedRecord;
  }

  setHasCachedRecord(value: boolean): void {
    this.#hasCachedRecord = value;
  }

  getTimeBytes(): Buffer {
    return this.#timeBytes;
  }

  getColumnSize(): number {
    return this.#columnSize;
  }

  getIgnoreTimestamp(): boolean {
    return this.#ignoreTimestamp;
  }

  getColumnNames(): string[] {
    return this.#columnNameList;
  }

  getColumnOrdinalDict(): Map<string, number> {
    return this.#columnOrdinalDict;
  }

  isNullByIndex(columnIndex: number): boolean {
    const index = this.#columnOrdinalDict.get(this.findColumnNameByIndex(columnIndex))! - IoTDBRpcDataSet.START_INDEX;
    if (index < 0) {
      return true;
    }
    return this.#isNull(index, this.#rowsIndex - 1);
  }

  getValues(): (Buffer | null)[] {
    return this.#value;
  }

  getColumnTypeDeduplicatedList(): (IoTDBDataType | null)[] {
    return this.#columnTypeDeduplicatedList;
  }

  findColumnNameByIndex(columnIndex: number): string {
    if (columnIndex <= 0 || columnIndex > this.#columnNameList.length) {
      throw new Error("Column index out of range");
    }
    return this.#columnNameList[columnIndex - 1];
  }

  #hasCachedResult(): boolean {
    return this.#queryDataSet !== null && this.#queryDataSet.time.length !== 0;
  }

  #constructOneRow(): void {
    this.#timeBytes = this.#queryDataSet.time.slice(0, 8);
    this.#queryDataSet.time = this.#queryDataSet.time.slice(8);

    for (let i = 0; i < this.#queryDataSet.bitmapList.length; i++) {
      const bitmapBuffer = this.#queryDataSet.bitmapList[i];

      if (this.#rowsIndex % 8 === 0) {
        this.#currentBitmap[i] = bitmapBuffer[0];
        this.#queryDataSet.bitmapList[i] = bitmapBuffer.slice(1);
      }

      if (!this.#isNull(i, this.#rowsIndex)) {
        const valueBuffer = this.#queryDataSet.valueList[i];
        const dataType = this.#columnTypeDeduplicatedList[i];

        switch (dataType) {
          case IoTDBDataType.BOOLEAN:
            this.#value[i] = valueBuffer.slice(0, 1);
            this.#queryDataSet.valueList[i] = valueBuffer.slice(1);
            break;
          case IoTDBDataType.INT32:
            this.#value[i] = valueBuffer.slice(0, 4);
            this.#queryDataSet.valueList[i] = valueBuffer.slice(4);
            break;
          case IoTDBDataType.INT64:
            this.#value[i] = valueBuffer.slice(0, 8);
            this.#queryDataSet.valueList[i] = valueBuffer.slice(8);
            break;
          case IoTDBDataType.FLOAT:
            this.#value[i] = valueBuffer.slice(0, 4);
            this.#queryDataSet.valueList[i] = valueBuffer.slice(4);
            break;
          case IoTDBDataType.DOUBLE:
            this.#value[i] = valueBuffer.slice(0, 8);
            this.#queryDataSet.valueList[i] = valueBuffer.slice(8);
            break;
          case IoTDBDataType.TEXT:
            const length = valueBuffer.readInt32BE(0);
            this.#value[i] = valueBuffer.slice(4, 4 + length);
            this.#queryDataSet.valueList[i] = valueBuffer.slice(4 + length);
            break;
          default:
            throw new Error(`Unsupported data type: ${dataType}`);
        }
      }
    }
    this.#rowsIndex += 1;
    this.#hasCachedRecord = true;
  }

  #isNull(index: number, rowNum: number): boolean {
    const bitmap = this.#currentBitmap[index];
    const shift = rowNum % 8;
    const bitmapValue = bitmap.readUInt8(0);  // Read the first byte as an unsigned integer
    return ((IoTDBRpcDataSet.FLAG >> shift) & (bitmapValue & 0xff)) === 0;
  }

  #fetchResults(): void {
    this.#rowsIndex = 0;
  }
}