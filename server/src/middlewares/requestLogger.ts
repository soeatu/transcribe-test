import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const requestId = uuidv4();
  (req as any).requestId = requestId;

  logger.info(`${req.method} ${req.path}`, {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
  });
  next();
}
