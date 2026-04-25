import { Request, Response, NextFunction } from "express";
import { sessionRepository } from "../repositories/sessionRepository";
import { transcriptRepository } from "../repositories/transcriptRepository";
import { summaryRepository } from "../repositories/summaryRepository";
import { openAIService } from "../services/openAIService";
import { AppError } from "../middlewares/errorHandler";

export class SummaryController {
  async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;

      const session = await sessionRepository.findById(sessionId);
      if (!session) {
        throw new AppError(404, "NOT_FOUND", "セッションが見つかりません");
      }

      const transcripts = await transcriptRepository.findBySessionId(sessionId);
      if (transcripts.length === 0) {
        throw new AppError(400, "NO_TRANSCRIPTS", "文字起こしデータがありません");
      }

      const participantNames = session.participants.map((p) => p.name);
      const summaryData = await openAIService.generateSummary(
        transcripts,
        session.title,
        participantNames
      );

      const summary = await summaryRepository.create({
        ...summaryData,
        sessionId,
      });

      res.json(summary);
    } catch (err) {
      next(err);
    }
  }

  async findBySessionId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await summaryRepository.findBySessionId(req.params.id as string);
      if (!summary) {
        throw new AppError(404, "NOT_FOUND", "要約が見つかりません");
      }
      res.json(summary);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const existing = await summaryRepository.findBySessionId(sessionId);
      if (!existing) {
        throw new AppError(404, "NOT_FOUND", "要約が見つかりません");
      }
      const updated = await summaryRepository.update(
        existing.id,
        sessionId,
        req.body
      );
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
}

export const summaryController = new SummaryController();
