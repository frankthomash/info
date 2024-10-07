import { SupportedMessageDataTypes } from "../utils/iotdb-constants";

export interface SupportedDataPoints {
  [key: string]: keyof typeof SupportedMessageDataTypes;
}

class DataPointsSchema {
  private dataPointsSchema: SupportedDataPoints;

  constructor(supportedDataPoints: SupportedDataPoints) {
    const properties: SupportedDataPoints = {};

    Object.entries(supportedDataPoints).forEach(([key, value]) => {
      if (Object.prototype.hasOwnProperty.call(SupportedMessageDataTypes, value)) {
        properties[key] = value;
      } else {
        throw new Error(
          `The initialized data points contains an unsupported data type: ${value}`,
        );
      }
    });

    this.dataPointsSchema = properties;
    Object.freeze(this.dataPointsSchema);
  }

  getDataPointsSchema(): SupportedDataPoints {
    return this.dataPointsSchema;
  }
}

/**
 * Type guard to check if a data type is supported by SupportedMessageDataTypes.
 *
 * @param type - The data type to check.
 * @returns A boolean indicating whether the type is valid.
 */
export function isSupportedDataPoint(type: string): type is keyof typeof SupportedMessageDataTypes {
  return Object.prototype.hasOwnProperty.call(SupportedMessageDataTypes, type);
}

// Singleton instance holder
let dataPointsSchemaInstance: DataPointsSchema | null = null;

/**
 * Creates and returns a singleton instance of DataPointsSchema.
 * If the instance does not already exist, it initializes it with the provided supported data points
 * and freezes the instance to prevent further modifications.
 *
 * @param supportedEndpoints - An object of supported data points to initialize the schema.
 * @returns The data points schema instance.
 */
export function createDataPointsSchema(supportedEndpoints: SupportedDataPoints): SupportedDataPoints {
  if (!dataPointsSchemaInstance) {
    dataPointsSchemaInstance = new DataPointsSchema(supportedEndpoints);
    Object.freeze(dataPointsSchemaInstance);
  }

  return dataPointsSchemaInstance.getDataPointsSchema();
}
