import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { modules } from './module.schema';
import { station } from './station.schema';

export type CrewStatus = 'active' | 'resting' | 'injured' | 'eva';

export const crewMembers = pgTable('crew_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  stationId: uuid('station_id')
    .notNull()
    .references(() => station.id),
  name: text('name').notNull(),
  role: text('role').notNull(),
  health: integer('health').notNull().default(100),
  status: text('status').$type<CrewStatus>().notNull().default('active'),
  assignedModuleId: uuid('assigned_module_id').references(() => modules.id),
});

export type CrewMember = typeof crewMembers.$inferSelect;
export type NewCrewMember = typeof crewMembers.$inferInsert;
