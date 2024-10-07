import { mediaElementsParams, databaseConfig, isDatabaseConfig } from "./database-params";
import { getEnvValue } from "../../../config/config";
import { User, Configuration, SyncConfiguration } from "realm"; // Import Realm SDK types

// Define the type for supported data points
export interface SupportedDataPoints {
  [key: string]: "boolean" | "string" | "float" | "double" | "int8" | "int16" | "uint8" | "uint16";
}

// Define the Realm schema structure
interface RealmSchema {
  primaryKey: string;
  name: string;
  properties: Record<string, string>;
}

// Create the media element schema
function createMediaElementSchema(supportedEndpoints: SupportedDataPoints): RealmSchema {
  const properties: Record<string, string> = { _id: "string" };

  Object.entries(supportedEndpoints).forEach(([key, value]) => {
    switch (value) {
      case "boolean":
        properties[key] = "bool";
        break;
      case "string":
      case "float":
      case "double":
        properties[key] = value;
        break;
      case "int8":
      case "int16":
      case "uint8":
      case "uint16":
        properties[key] = "int";
        break;
      default:
        throw new Error(`The initialized data points contain an unsupported data type: ${value}`);
    }
  });

  return {
    primaryKey: "_id",
    name: mediaElementsParams.VSS.databaseName, // Assuming mediaElementsParams contains 'VSS'
    properties: properties,
  };
}

// Configure the Realm database settings
export function realmConfig(user: User, supportedDataPoints: SupportedDataPoints): Configuration {
  const mediaElementSchema = createMediaElementSchema(supportedDataPoints);
  
  if (!isDatabaseConfig(databaseConfig)) {
    throw new Error("Invalid database configuration.");
  }
  
  return {
    schema: [mediaElementSchema],
    path: databaseConfig.storePath,
    sync: {
      user: user,
      flexible: true,
      error: (error: Error) => {
        console.error("Realm sync error:", error);
      },
    } as SyncConfiguration, // Cast sync as SyncConfiguration
    schemaVersion: getSchemaVersion(),
    // migration: (oldRealm: any, newRealm: any) => {
    //   // Migration logic here
    // },
  };
}

// Get the schema version from environment variables
const getSchemaVersion = (): number => {
  const schemaVersion = parseInt(getEnvValue("VERSION_REALMDB_SCHEMA") ?? "", 10);
  if (isNaN(schemaVersion)) {
    throw new Error(
      "Version must be specified as an ENV variable and it must be 0 or a positive integer"
    );
  }
  return schemaVersion;
};
