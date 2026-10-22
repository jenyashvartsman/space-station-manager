import { NextFunction, Request, Response } from 'express';

import { ConflictError, NotFoundError, ValidationError } from '../shared/errors.js';

interface DomainError extends Error {
  status: number;
  code: string;
}

function isDomainError(err: unknown): err is DomainError {
  return (
    err instanceof NotFoundError || err instanceof ValidationError || err instanceof ConflictError
  );
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
): void {
  if (isDomainError(err)) {
    res.status(err.status).json({ error: err.message, code: err.code });
    return;
  }

  if (err instanceof Error) {
    console.error(err.stack); // eslint-disable-line no-console
  }

  res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
}
