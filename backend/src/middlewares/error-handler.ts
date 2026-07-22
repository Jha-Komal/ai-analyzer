import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiResponse } from '../types';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[ErrorHandler]', err);

  if (err instanceof ZodError) {
    const response: ApiResponse = {
      success: false,
      error: 'Validation error',
      message: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
    };
    res.status(400).json(response);
    return;
  }

  const response: ApiResponse = {
    success: false,
    error: err.message || 'Internal server error',
  };
  res.status(500).json(response);
}
