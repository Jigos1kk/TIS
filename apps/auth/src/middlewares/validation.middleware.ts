import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { BadRequestError, ConflictError } from "../common/errors/app-error.js";

function formatZodErrors(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.join(".");
    return path ? `${path}: ${issue.message}` : issue.message;
  });
}

/**
 * Обобщенный middleware для синхронной/структурной валидации по схеме Zod.
 */
export function validateBody<T>(schema: ZodType<T>) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formattedErrors = formatZodErrors(result.error);
      return next(new BadRequestError("Validation failed", formattedErrors));
    }
    req.body = result.data;
    next();
  };
}


