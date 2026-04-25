import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = (req as any).requestId || "unknown";

  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.code} - ${err.message}`, { requestId });
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  logger.error(`Unhandled error: ${err.message}`, {
    requestId,
    stack: err.stack,
  });

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "内部サーバーエラーが発生しました",
    },
    requestId,
    timestamp: new Date().toISOString(),
  });
}
