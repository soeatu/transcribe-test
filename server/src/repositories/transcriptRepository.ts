import { v4 as uuidv4 } from "uuid";
import { getContainer } from "../config/cosmos";
import { logger } from "../utils/logger";
import { Transcript, CreateTranscriptRequest } from "../models/transcript";

export class TranscriptRepository {
  private getContainerOrThrow() {
    const container = getContainer();
    if (!container) {
      throw new Error("Cosmos DB が未設定です");
    }
    return container;
  }

  async create(
    sessionId: string,
    req: CreateTranscriptRequest
  ): Promise<Transcript> {
    const container = this.getContainerOrThrow();
    const now = new Date().toISOString();

    const transcript: Transcript = {
      id: uuidv4(),
      partitionKey: sessionId,
      type: "transcript",
      sessionId,
      speakerId: req.speakerId,
      speakerName: req.speakerName,
      text: req.text,
      timestamp: now,
      offsetMs: req.offsetMs,
      isFinal: req.isFinal,
    };

    const { resource } = await container.items.create(transcript);
    logger.debug(`Transcript saved: session=${sessionId}, offset=${req.offsetMs}`);
    return resource as Transcript;
  }

  async findBySessionId(sessionId: string): Promise<Transcript[]> {
    const container = this.getContainerOrThrow();
    const { resources } = await container.items
      .query<Transcript>({
        query:
          "SELECT * FROM c WHERE c.type = 'transcript' AND c.sessionId = @sid ORDER BY c.offsetMs",
        parameters: [{ name: "@sid", value: sessionId }],
      })
      .fetchAll();
    return resources;
  }
}

export const transcriptRepository = new TranscriptRepository();
