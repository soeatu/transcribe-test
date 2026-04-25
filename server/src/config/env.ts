import dotenv from "dotenv";
dotenv.config();

export const env = {
  // Server
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  // Azure Speech Service
  azureSpeechKey: process.env.AZURE_SPEECH_KEY || "",
  azureSpeechRegion: process.env.AZURE_SPEECH_REGION || "japaneast",

  // Azure OpenAI Service
  azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
  azureOpenAIKey: process.env.AZURE_OPENAI_KEY || "",
  azureOpenAIDeployment: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",

  // Azure Web PubSub
  azurePubSubConnectionString:
    process.env.AZURE_PUBSUB_CONNECTION_STRING || "",
  azurePubSubHubName: process.env.AZURE_PUBSUB_HUB_NAME || "transcription",

  // Azure Cosmos DB
  cosmosDbEndpoint: process.env.COSMOS_DB_ENDPOINT || "",
  cosmosDbKey: process.env.COSMOS_DB_KEY || "",
  cosmosDbDatabase: process.env.COSMOS_DB_DATABASE || "transcribe-app",
  cosmosDbContainer: process.env.COSMOS_DB_CONTAINER || "sessions",

  // Helpers
  isDev(): boolean {
    return this.nodeEnv === "development";
  },
  isProd(): boolean {
    return this.nodeEnv === "production";
  },
} as const;
