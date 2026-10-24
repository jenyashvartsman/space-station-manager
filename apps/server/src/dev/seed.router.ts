import { Router } from 'express';
import { runSeed } from '@space-station/db';

export const devSeedRouter = Router();

devSeedRouter.post('/dev/seed', async (_req, res) => {
  try {
    await runSeed();
    res.json({ ok: true, message: 'Database seeded successfully' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ ok: false, error: message });
  }
});
