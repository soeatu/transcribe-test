import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "./errorHandler";

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }));
      next(new AppError(400, "VALIDATION_ERROR", "リクエストパラメータが不正です", details));
      return;
    }
    req.body = result.data;
    next();
  };
}
