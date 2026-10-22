import { db, schema } from '@space-station/db';
import { eq } from 'drizzle-orm';

import type { Station } from '@space-station/db';

export const StationRepository = {
  async findFirst(): Promise<Station | undefined> {
    const rows = await db.select().from(schema.station).limit(1);
    return rows[0];
  },

  async update(id: string, data: { name: string; updatedAt: Date }): Promise<Station | undefined> {
    const rows = await db
      .update(schema.station)
      .set(data)
      .where(eq(schema.station.id, id))
      .returning();
    return rows[0];
  },
};
