import { Router } from 'express';

import { ResourceService } from './resource.service.js';

export const resourceRouter = Router();

resourceRouter.get('/resources', async (_req, res, next) => {
  try {
    const resources = await ResourceService.getAllResources();
    res.json({ data: resources });
  } catch (err) {
    next(err);
  }
});
