import { Request, Response, NextFunction } from "express";
import { sessionRepository } from "../repositories/sessionRepository";
import { AppError } from "../middlewares/errorHandler";
import { CreateSessionRequest, UpdateSessionRequest } from "../models/session";

export class SessionController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as CreateSessionRequest;
      const session = await sessionRepository.create(body);
      res.status(201).json(session);
    } catch (err) {
      next(err);
    }
  }

  async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessions = await sessionRepository.findAll();
      res.json(sessions);
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await sessionRepository.findById(req.params.id as string);
      if (!session) {
        throw new AppError(404, "NOT_FOUND", "セッションが見つかりません");
      }
      res.json(session);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as UpdateSessionRequest;
      const updates: any = { ...body };
      if (body.status === "ended") {
        updates.endedAt = new Date().toISOString();
      }
      const session = await sessionRepository.update(req.params.id as string, updates);
      if (!session) {
        throw new AppError(404, "NOT_FOUND", "セッションが見つかりません");
      }
      res.json(session);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await sessionRepository.delete(req.params.id as string);
      if (!deleted) {
        throw new AppError(404, "NOT_FOUND", "セッションが見つかりません");
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export const sessionController = new SessionController();
