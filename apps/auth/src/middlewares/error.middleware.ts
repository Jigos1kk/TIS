import { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/errors/app-error.js';
import { ZodError } from 'zod';

// Centralized middleware to convert errors to consistent JSON format
export function errorHandler(
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      status: 'validation_error',
      error: {
        message: 'Validation failed',
        details: err.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      status: 'error',
      error: {
        message: err.message,
      },
    });
    return;
  }

  console.error('[ErrorHandler] Internal Server Error:', err);
  res.status(500).json({
    success: false,
    status: 'internal_error',
    error: {
      message: 'Internal server error',
    },
  });
}

export const errorMiddleware = errorHandler;
