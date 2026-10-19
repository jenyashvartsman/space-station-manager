import { doublePrecision, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { station } from './station.schema';

export type ModuleStatus = 'nominal' | 'warning' | 'critical' | 'offline';

export const modules = pgTable('modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  stationId: uuid('station_id')
    .notNull()
    .references(() => station.id),
  type: text('type').notNull(),
  name: text('name').notNull(),
  status: text('status').$type<ModuleStatus>().notNull().default('nominal'),
  powerConsumption: doublePrecision('power_consumption').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Module = typeof modules.$inferSelect;
export type NewModule = typeof modules.$inferInsert;
