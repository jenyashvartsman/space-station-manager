import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { healthRouter } from './health.router.js';

const app = express();
app.use(healthRouter);

describe('GET /health', () => {
  it('returns 200 with status ok and uptime', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime).toBe('number');
  });
});
