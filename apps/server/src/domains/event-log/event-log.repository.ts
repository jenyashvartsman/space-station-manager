import { db, schema } from '@space-station/db';
import { desc } from 'drizzle-orm';

import type { EventLog, NewEventLog } from '@space-station/db';

export const EventLogRepository = {
  async getRecent(limit: number): Promise<EventLog[]> {
    return db
      .select()
      .from(schema.eventLog)
      .orderBy(desc(schema.eventLog.createdAt))
      .limit(limit);
  },

  async create(data: NewEventLog): Promise<EventLog> {
    const rows = await db.insert(schema.eventLog).values(data).returning();
    return rows[0]!;
  },
};
