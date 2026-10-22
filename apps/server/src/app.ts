import cors from 'cors';
import express from 'express';

import { crewRouter } from './domains/crew/crew.router.js';
import { eventLogRouter } from './domains/event-log/event-log.router.js';
import { missionRouter } from './domains/mission/mission.router.js';
import { moduleRouter } from './domains/module/module.router.js';
import { resourceRouter } from './domains/resource/resource.router.js';
import { stationRouter } from './domains/station/station.router.js';
import { healthRouter } from './health.router.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.use(healthRouter);
app.use(stationRouter);
app.use(resourceRouter);
app.use(crewRouter);
app.use(moduleRouter);
app.use(missionRouter);
app.use(eventLogRouter);

app.use(errorMiddleware);
