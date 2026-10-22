import { db, schema } from '@space-station/db';
import { eq, sql } from 'drizzle-orm';

import type { CrewMember, Module } from '@space-station/db';
import type { ModuleWithCrewCountResponse } from './module.types.js';

export const ModuleRepository = {
  async findAll(): Promise<ModuleWithCrewCountResponse[]> {
    const rows = await db
      .select({
        id: schema.modules.id,
        stationId: schema.modules.stationId,
        type: schema.modules.type,
        name: schema.modules.name,
        status: schema.modules.status,
        powerConsumption: schema.modules.powerConsumption,
        createdAt: schema.modules.createdAt,
        crewCount: sql<number>`cast(count(${schema.crewMembers.id}) as int)`,
      })
      .from(schema.modules)
      .leftJoin(schema.crewMembers, eq(schema.modules.id, schema.crewMembers.assignedModuleId))
      .groupBy(schema.modules.id);
    return rows;
  },

  async findById(id: string): Promise<Module | undefined> {
    const rows = await db
      .select()
      .from(schema.modules)
      .where(eq(schema.modules.id, id))
      .limit(1);
    return rows[0];
  },

  async findCrewByModuleId(moduleId: string): Promise<CrewMember[]> {
    return db
      .select()
      .from(schema.crewMembers)
      .where(eq(schema.crewMembers.assignedModuleId, moduleId));
  },

  async update(
    id: string,
    data: Partial<Pick<Module, 'status' | 'name'>>,
  ): Promise<Module | undefined> {
    const rows = await db
      .update(schema.modules)
      .set(data)
      .where(eq(schema.modules.id, id))
      .returning();
    return rows[0];
  },
};
