import type { EventLog } from '@space-station/db';

import { EventLogRepository } from './event-log.repository.js';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export const EventLogService = {
  async getRecentEvents(limit?: number): Promise<EventLog[]> {
    const resolved = Math.min(limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    return EventLogRepository.getRecent(resolved);
  },
};
