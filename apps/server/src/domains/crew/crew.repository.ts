import { db, schema } from '@space-station/db';
import { eq } from 'drizzle-orm';

import type { CrewMember } from '@space-station/db';
import type { CrewWithModuleResponse } from './crew.types.js';

export const CrewRepository = {
  async findAll(): Promise<CrewWithModuleResponse[]> {
    const rows = await db
      .select({
        id: schema.crewMembers.id,
        stationId: schema.crewMembers.stationId,
        name: schema.crewMembers.name,
        role: schema.crewMembers.role,
        health: schema.crewMembers.health,
        status: schema.crewMembers.status,
        assignedModuleId: schema.crewMembers.assignedModuleId,
        moduleId: schema.modules.id,
        moduleName: schema.modules.name,
        moduleType: schema.modules.type,
        moduleStatus: schema.modules.status,
      })
      .from(schema.crewMembers)
      .leftJoin(schema.modules, eq(schema.crewMembers.assignedModuleId, schema.modules.id));

    return rows.map(({ moduleId, moduleName, moduleType, moduleStatus, ...crew }) => ({
      ...crew,
      assignedModule:
        moduleId != null
          ? { id: moduleId, name: moduleName!, type: moduleType!, status: moduleStatus! }
          : null,
    }));
  },

  async findById(id: string): Promise<CrewMember | undefined> {
    const rows = await db
      .select()
      .from(schema.crewMembers)
      .where(eq(schema.crewMembers.id, id))
      .limit(1);
    return rows[0];
  },

  async update(
    id: string,
    data: Partial<Pick<CrewMember, 'status' | 'health' | 'assignedModuleId'>>,
  ): Promise<CrewMember | undefined> {
    const rows = await db
      .update(schema.crewMembers)
      .set(data)
      .where(eq(schema.crewMembers.id, id))
      .returning();
    return rows[0];
  },

  async setStatusByModuleId(moduleId: string, status: CrewMember['status']): Promise<void> {
    await db
      .update(schema.crewMembers)
      .set({ status })
      .where(eq(schema.crewMembers.assignedModuleId, moduleId));
  },
};
