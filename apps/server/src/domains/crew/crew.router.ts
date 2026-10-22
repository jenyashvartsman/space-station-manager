import { Router } from 'express';
import { z } from 'zod';

import { ValidationError } from '../../shared/errors.js';
import { CrewService } from './crew.service.js';

export const crewRouter = Router();

const updateCrewSchema = z.object({
  status: z.enum(['active', 'resting', 'injured', 'eva']).optional(),
  health: z.number().min(0).max(100).optional(),
  assignedModuleId: z.string().uuid().nullable().optional(),
});

crewRouter.get('/crew', async (_req, res, next) => {
  try {
    const crew = await CrewService.getAllCrew();
    res.json({ data: crew });
  } catch (err) {
    next(err);
  }
});

crewRouter.get('/crew/:id', async (req, res, next) => {
  try {
    const crew = await CrewService.getCrewMember(req.params.id);
    res.json({ data: crew });
  } catch (err) {
    next(err);
  }
});

crewRouter.patch('/crew/:id', async (req, res, next) => {
  try {
    const parsed = updateCrewSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.errors[0]?.message ?? 'Invalid request body');
    }
    const crew = await CrewService.updateCrewMember(req.params.id, parsed.data);
    res.json({ data: crew });
  } catch (err) {
    next(err);
  }
});
