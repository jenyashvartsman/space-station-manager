import { Router } from 'express';
import { z } from 'zod';

import { ValidationError } from '../../shared/errors.js';
import { MissionService } from './mission.service.js';

export const missionRouter = Router();

const createMissionSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  durationSeconds: z.number().int().min(10),
  reward: z.record(z.number()).optional(),
});

const updateMissionSchema = z.object({
  status: z.enum(['active', 'complete', 'failed']),
});

missionRouter.get('/missions', async (req, res, next) => {
  try {
    const statusParam = req.query['status'];
    const status =
      statusParam !== undefined
        ? (String(statusParam) as 'queued' | 'active' | 'complete' | 'failed')
        : undefined;
    const missions = await MissionService.getAllMissions(status);
    res.json({ data: missions });
  } catch (err) {
    next(err);
  }
});

missionRouter.get('/missions/:id', async (req, res, next) => {
  try {
    const mission = await MissionService.getMission(req.params.id);
    res.json({ data: mission });
  } catch (err) {
    next(err);
  }
});

missionRouter.post('/missions', async (req, res, next) => {
  try {
    const parsed = createMissionSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.errors[0]?.message ?? 'Invalid request body');
    }
    const mission = await MissionService.createMission(parsed.data);
    res.status(201).json({ data: mission });
  } catch (err) {
    next(err);
  }
});

missionRouter.patch('/missions/:id', async (req, res, next) => {
  try {
    const parsed = updateMissionSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.errors[0]?.message ?? 'Invalid request body');
    }
    const mission = await MissionService.updateMissionStatus(req.params.id, parsed.data);
    res.json({ data: mission });
  } catch (err) {
    next(err);
  }
});
