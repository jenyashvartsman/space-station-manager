import { Router } from 'express';

import { EventLogService } from './event-log.service.js';

export const eventLogRouter = Router();

eventLogRouter.get('/events', async (req, res, next) => {
  try {
    const limitParam = req.query['limit'];
    const limit = limitParam !== undefined ? parseInt(String(limitParam), 10) : undefined;
    const events = await EventLogService.getRecentEvents(limit);
    res.json({ data: events });
  } catch (err) {
    next(err);
  }
});
