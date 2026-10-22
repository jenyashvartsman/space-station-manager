import express, { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { ConflictError, NotFoundError, ValidationError } from '../shared/errors.js';
import { errorMiddleware } from './error.middleware.js';

function createTestApp(thrower: (req: Request, res: Response, next: NextFunction) => void) {
  const app = express();
  app.get('/test', thrower);
  app.use(errorMiddleware);
  return app;
}

describe('errorMiddleware', () => {
  it('returns 404 for NotFoundError', async () => {
    const app = createTestApp((_req, _res, next) => next(new NotFoundError('Crew not found')));
    const res = await request(app).get('/test');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: 'Crew not found', code: 'NOT_FOUND' });
  });

  it('returns 400 for ValidationError', async () => {
    const app = createTestApp((_req, _res, next) => next(new ValidationError('Invalid input')));
    const res = await request(app).get('/test');
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ error: 'Invalid input', code: 'VALIDATION_ERROR' });
  });

  it('returns 409 for ConflictError', async () => {
    const app = createTestApp((_req, _res, next) => next(new ConflictError('Already exists')));
    const res = await request(app).get('/test');
    expect(res.status).toBe(409);
    expect(res.body).toMatchObject({ error: 'Already exists', code: 'CONFLICT' });
  });

  it('returns 500 for unknown errors', async () => {
    const app = createTestApp((_req, _res, next) => next(new Error('Something broke')));
    const res = await request(app).get('/test');
    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  });
});
