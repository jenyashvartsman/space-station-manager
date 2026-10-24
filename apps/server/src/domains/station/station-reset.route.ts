import { Router } from 'express';
import { runSeed } from '@space-station/db';

export const stationResetRouter = Router();

stationResetRouter.post('/station/reset', async (_req, res) => {
  try {
    await runSeed();
    res.json({ message: 'Station reset complete' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});
