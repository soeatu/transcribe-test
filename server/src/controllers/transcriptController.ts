import { Request, Response, NextFunction } from "express";
import { transcriptRepository } from "../repositories/transcriptRepository";
import { pubsubService } from "../services/pubsubService";
import { CreateTranscriptRequest } from "../models/transcript";

export class TranscriptController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const body = req.body as CreateTranscriptRequest;
      const transcript = await transcriptRepository.create(sessionId, body);

      // Web PubSub 経由でブロードキャスト
      await pubsubService.sendToGroup(sessionId, {
        type: "transcript",
        payload: transcript,
        timestamp: new Date().toISOString(),
      });

      res.status(201).json(transcript);
    } catch (err) {
      next(err);
    }
  }

  async findBySessionId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transcripts = await transcriptRepository.findBySessionId(req.params.id as string);
      res.json(transcripts);
    } catch (err) {
      next(err);
    }
  }
}

export const transcriptController = new TranscriptController();
