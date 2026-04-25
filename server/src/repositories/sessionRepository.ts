import { v4 as uuidv4 } from "uuid";
import { getContainer } from "../config/cosmos";
import { logger } from "../utils/logger";
import { Session, CreateSessionRequest } from "../models/session";

export class SessionRepository {
  private getContainerOrThrow() {
    const container = getContainer();
    if (!container) {
      throw new Error("Cosmos DB が未設定です");
    }
    return container;
  }

  async create(req: CreateSessionRequest): Promise<Session> {
    const container = this.getContainerOrThrow();
    const id = uuidv4();
    const now = new Date().toISOString();

    const session: Session = {
      id,
      partitionKey: id,
      type: "session",
      title: req.title,
      status: "preparing",
      participants: req.participants.map((p, i) => ({
        id: uuidv4(),
        name: p.name,
        speakerLabel: `Speaker${i + 1}`,
      })),
      language: req.language ?? "ja-JP",
      shareUrl: `/sessions/${id}`,
      createdAt: now,
      endedAt: null,
    };

    const { resource } = await container.items.create(session);
    logger.info(`Session created: ${id}`);
    return resource as Session;
  }

  async findById(id: string): Promise<Session | null> {
    const container = this.getContainerOrThrow();
    try {
      const { resource } = await container.item(id, id).read<Session>();
      return resource && resource.type === "session" ? resource : null;
    } catch (err: any) {
      if (err.code === 404) return null;
      throw err;
    }
  }

  async findAll(): Promise<Session[]> {
    const container = this.getContainerOrThrow();
    const { resources } = await container.items
      .query<Session>({
        query:
          "SELECT * FROM c WHERE c.type = 'session' ORDER BY c.createdAt DESC",
      })
      .fetchAll();
    return resources;
  }

  async update(
    id: string,
    updates: Partial<Pick<Session, "title" | "status" | "participants" | "endedAt">>
  ): Promise<Session | null> {
    const container = this.getContainerOrThrow();
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    const { resource } = await container.item(id, id).replace(updated);
    logger.info(`Session updated: ${id}`);
    return resource as Session;
  }

  async delete(id: string): Promise<boolean> {
    const container = this.getContainerOrThrow();
    try {
      await container.item(id, id).delete();
      logger.info(`Session deleted: ${id}`);
      return true;
    } catch (err: any) {
      if (err.code === 404) return false;
      throw err;
    }
  }
}

export const sessionRepository = new SessionRepository();
