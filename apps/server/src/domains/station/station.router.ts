import { Router } from 'express';
import { z } from 'zod';

import { ValidationError } from '../../shared/errors.js';
import { StationService } from './station.service.js';

export const stationRouter = Router();

const updateStationSchema = z.object({
  name: z.string().min(1).optional(),
});

stationRouter.get('/station', async (_req, res, next) => {
  try {
    const station = await StationService.getStation();
    res.json({ data: station });
  } catch (err) {
    next(err);
  }
});

stationRouter.patch('/station', async (req, res, next) => {
  try {
    const parsed = updateStationSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.errors[0]?.message ?? 'Invalid request body');
    }
    const station = await StationService.updateStation(parsed.data);
    res.json({ data: station });
  } catch (err) {
    next(err);
  }
});
