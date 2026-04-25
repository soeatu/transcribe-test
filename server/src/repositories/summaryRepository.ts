import { v4 as uuidv4 } from "uuid";
import { getContainer } from "../config/cosmos";
import { logger } from "../utils/logger";
import { Summary } from "../models/summary";

export class SummaryRepository {
  private getContainerOrThrow() {
    const container = getContainer();
    if (!container) {
      throw new Error("Cosmos DB が未設定です");
    }
    return container;
  }

  async create(summary: Omit<Summary, "id" | "partitionKey" | "type">): Promise<Summary> {
    const container = this.getContainerOrThrow();

    const doc: Summary = {
      id: uuidv4(),
      partitionKey: summary.sessionId,
      type: "summary",
      ...summary,
    };

    const { resource } = await container.items.create(doc);
    logger.info(`Summary created: session=${summary.sessionId}`);
    return resource as Summary;
  }

  async findBySessionId(sessionId: string): Promise<Summary | null> {
    const container = this.getContainerOrThrow();
    const { resources } = await container.items
      .query<Summary>({
        query:
          "SELECT * FROM c WHERE c.type = 'summary' AND c.sessionId = @sid",
        parameters: [{ name: "@sid", value: sessionId }],
      })
      .fetchAll();
    return resources.length > 0 ? resources[0] : null;
  }

  async update(
    id: string,
    sessionId: string,
    updates: Partial<Summary>
  ): Promise<Summary | null> {
    const container = this.getContainerOrThrow();
    const existing = await this.findBySessionId(sessionId);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    const { resource } = await container
      .item(id, sessionId)
      .replace(updated);
    logger.info(`Summary updated: session=${sessionId}`);
    return resource as Summary;
  }
}

export const summaryRepository = new SummaryRepository();
