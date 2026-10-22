import { Router } from 'express';
import { z } from 'zod';

import { ValidationError } from '../../shared/errors.js';
import { ModuleService } from './module.service.js';

export const moduleRouter = Router();

const updateModuleSchema = z.object({
  status: z.enum(['nominal', 'warning', 'critical', 'offline']).optional(),
  name: z.string().min(1).optional(),
});

moduleRouter.get('/modules', async (_req, res, next) => {
  try {
    const modules = await ModuleService.getAllModules();
    res.json({ data: modules });
  } catch (err) {
    next(err);
  }
});

moduleRouter.get('/modules/:id', async (req, res, next) => {
  try {
    const mod = await ModuleService.getModule(req.params.id);
    res.json({ data: mod });
  } catch (err) {
    next(err);
  }
});

moduleRouter.patch('/modules/:id', async (req, res, next) => {
  try {
    const parsed = updateModuleSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.errors[0]?.message ?? 'Invalid request body');
    }
    const mod = await ModuleService.updateModule(req.params.id, parsed.data);
    res.json({ data: mod });
  } catch (err) {
    next(err);
  }
});
