import { getEnvValue } from "../../../config/config";

// Type guard to check if databaseConfig exists
export function isDatabaseConfig(config: typeof databaseConfig): config is { storePath: string; realmAppId: string; realmApiKey: string } {
    return config !== undefined && "storePath" in config && "realmAppId" in config && "realmApiKey" in config;
}

/**
 * Contains the definition of the database name and its identifier data point for each catalog.
 */
export const mediaElementsParams: Readonly<Record<string, { databaseName: string; dataPointId: string }>> = Object.freeze({
  VSS: {
    databaseName: "Vehicles", // name of the configured RealmDB for the VSS database
    dataPointId: "Vehicle_VehicleIdentification_VIN", // data point used as element ID
  },
});

/**
 * Retrieves the database configuration.
 *
 * This function fetches the Realm application ID and API key from the environment variables.
 * If either of these values is not found, it throws an error.
 *
 * @throws {Error} If the REALMDB_APP_ID is not set in the environment variables.
 * @throws {Error} If the REALMDB_API_KEY is not set in the environment variables.
 *
 * @returns {Object} The database configuration object containing:
 * - storePath: The path to the Realm database file.
 * - realmAppId: The Realm application ID.
 * - realmApiKey: The Realm API key.
 */
const getDatabaseConfig = (): { storePath: string; realmAppId: string; realmApiKey: string } => {
  const realmAppId = getEnvValue("REALMDB_APP_ID");
  const realmApiKey = getEnvValue("REALMDB_API_KEY");

  if (!realmAppId) {
    throw new Error("REALMDB_APP_ID is required, but no default has been set");
  } else if (!realmApiKey) {
    throw new Error("REALMDB_API_KEY is required, but no default has been set");
  }

  return Object.freeze({
    storePath: "myrealm12.realm",
    realmAppId: realmAppId,
    realmApiKey: realmApiKey,
  });
};

/**
 * Exports the database configuration depending on the handler type.
 */
export const databaseConfig = getEnvValue("HANDLER_TYPE") === "realmdb" ? getDatabaseConfig() : undefined;
