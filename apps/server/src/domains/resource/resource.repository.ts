import { db, schema } from '@space-station/db';
import { eq } from 'drizzle-orm';

import type { Resource } from '@space-station/db';

export const ResourceRepository = {
  async findAll(): Promise<Resource[]> {
    return db.select().from(schema.resources);
  },

  async updateCurrent(id: string, current: number): Promise<void> {
    await db
      .update(schema.resources)
      .set({ current, updatedAt: new Date() })
      .where(eq(schema.resources.id, id));
  },
};
