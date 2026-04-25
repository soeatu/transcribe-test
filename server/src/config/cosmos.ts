import { CosmosClient, Database, Container } from "@azure/cosmos";
import { env } from "./env";
import { logger } from "../utils/logger";

let client: CosmosClient | null = null;
let database: Database | null = null;
let container: Container | null = null;

export function getCosmosClient(): CosmosClient | null {
  if (!env.cosmosDbEndpoint || !env.cosmosDbKey) {
    logger.warn(
      "Cosmos DB の接続情報が未設定です。データベース操作はスキップされます。"
    );
    return null;
  }

  if (!client) {
    client = new CosmosClient({
      endpoint: env.cosmosDbEndpoint,
      key: env.cosmosDbKey,
    });
  }
  return client;
}

export function getDatabase(): Database | null {
  const c = getCosmosClient();
  if (!c) return null;

  if (!database) {
    database = c.database(env.cosmosDbDatabase);
  }
  return database;
}

export function getContainer(): Container | null {
  const db = getDatabase();
  if (!db) return null;

  if (!container) {
    container = db.container(env.cosmosDbContainer);
  }
  return container;
}
