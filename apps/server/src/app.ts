import cors from 'cors';
import express from 'express';

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

app.use(errorMiddleware);
