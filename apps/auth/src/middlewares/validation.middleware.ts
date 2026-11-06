import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { BadRequestError, ConflictError } from "../common/errors/app-error.js";
import { createUserSchema } from "../validator/user.validator.js";
import { userRepository, UserRepository } from "../database/repository/user.repository.js";

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

/**
 * Фабрика middleware для проверки уникальности email и username.
 * По Clean Architecture внедряется UserRepository.
 */
export function validateRegister(userRepo: UserRepository = userRepository) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    // 1. Валидация формата и структуры через Zod
    const schemaResult = createUserSchema.safeParse(req.body);
    if (!schemaResult.success) {
      const formattedErrors = formatZodErrors(schemaResult.error);
      return next(new BadRequestError("Validation failed", formattedErrors));
    }

    const { email, username } = schemaResult.data;
    const emailNormalize = email.trim().toLowerCase();
    const usernameNormalize = username.trim().toLowerCase();

    try {
      const existingUser = await userRepo.findByEmailOrUsername(emailNormalize, usernameNormalize);
      if (existingUser) {
        const errors: string[] = [];
        if (existingUser.emailNormalize === emailNormalize) {
          errors.push("Email is already taken");
        }
        if (existingUser.usernameNormalize === usernameNormalize) {
          errors.push("Username is already taken");
        }
        return next(new ConflictError(errors.length > 0 ? errors.join("; ") : "User already exists"));
      }

      req.body = schemaResult.data;
      next();
    } catch (error) {
      next(error);
    }
  };
}
