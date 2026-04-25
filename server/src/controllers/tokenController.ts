import { Request, Response, NextFunction } from "express";
import { speechTokenService } from "../services/speechTokenService";
import { pubsubService } from "../services/pubsubService";
import { AppError } from "../middlewares/errorHandler";

export class TokenController {
  async getSpeechToken(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = await speechTokenService.getToken();
      res.json(token);
    } catch (err) {
      next(err);
    }
  }

  async negotiatePubSub(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId, userId } = req.body;
      if (!sessionId || !userId) {
        throw new AppError(400, "VALIDATION_ERROR", "sessionId と userId は必須です");
      }

      const result = await pubsubService.getClientUrl(sessionId, userId);
      if (!result) {
        throw new AppError(503, "SERVICE_UNAVAILABLE", "Web PubSub が利用できません");
      }

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const tokenController = new TokenController();
