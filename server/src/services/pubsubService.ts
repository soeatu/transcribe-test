import { WebPubSubServiceClient } from "@azure/web-pubsub";
import { env } from "../config/env";
import { logger } from "../utils/logger";

let client: WebPubSubServiceClient | null = null;

function getClient(): WebPubSubServiceClient | null {
  if (!env.azurePubSubConnectionString) {
    logger.warn("Web PubSub の接続文字列が未設定です");
    return null;
  }
  if (!client) {
    client = new WebPubSubServiceClient(
      env.azurePubSubConnectionString,
      env.azurePubSubHubName
    );
  }
  return client;
}

export class PubSubService {
  async getClientUrl(
    sessionId: string,
    userId: string
  ): Promise<{ url: string } | null> {
    const c = getClient();
    if (!c) return null;

    const token = await c.getClientAccessToken({
      userId,
      groups: [sessionId],
      roles: [
        `webpubsub.joinLeaveGroup.${sessionId}`,
        `webpubsub.sendToGroup.${sessionId}`,
      ],
      expirationTimeInMinutes: 60,
    });

    logger.debug(`PubSub client URL generated for session=${sessionId}`);
    return { url: token.url };
  }

  async sendToGroup(sessionId: string, message: unknown): Promise<void> {
    const c = getClient();
    if (!c) {
      logger.warn("PubSub 未設定のためブロードキャストをスキップします");
      return;
    }

    await c.sendToAll(JSON.stringify(message), {
      contentType: "text/plain",
      filter: `'${sessionId}' in groups`,
    });

    logger.debug(`PubSub message sent to group=${sessionId}`);
  }
}

export const pubsubService = new PubSubService();
