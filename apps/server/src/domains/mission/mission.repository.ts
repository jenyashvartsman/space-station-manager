import { db, schema } from '@space-station/db';
import { eq } from 'drizzle-orm';

import type { Mission, MissionStatus, NewMission } from '@space-station/db';

export const MissionRepository = {
  async findAll(status?: MissionStatus): Promise<Mission[]> {
    if (status) {
      return db.select().from(schema.missions).where(eq(schema.missions.status, status));
    }
    return db.select().from(schema.missions);
  },

  async findById(id: string): Promise<Mission | undefined> {
    const rows = await db
      .select()
      .from(schema.missions)
      .where(eq(schema.missions.id, id))
      .limit(1);
    return rows[0];
  },

  async findActive(): Promise<Mission[]> {
    return db.select().from(schema.missions).where(eq(schema.missions.status, 'active'));
  },

  async create(data: NewMission): Promise<Mission> {
    const rows = await db.insert(schema.missions).values(data).returning();
    return rows[0]!;
  },

  async update(
    id: string,
    data: Partial<Pick<Mission, 'status' | 'startedAt' | 'completedAt'>>,
  ): Promise<Mission | undefined> {
    const rows = await db
      .update(schema.missions)
      .set(data)
      .where(eq(schema.missions.id, id))
      .returning();
    return rows[0];
  },
};
