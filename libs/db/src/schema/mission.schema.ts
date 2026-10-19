import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { station } from './station.schema';

export type MissionStatus = 'queued' | 'active' | 'complete' | 'failed';

export const missions = pgTable(
  'missions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    stationId: uuid('station_id')
      .notNull()
      .references(() => station.id),
    title: text('title').notNull(),
    description: text('description').notNull(),
    status: text('status').$type<MissionStatus>().notNull().default('queued'),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    reward: jsonb('reward'),
  },
  (table) => ({
    stationStatusIdx: index('missions_station_status_idx').on(table.stationId, table.status),
  }),
);

export type Mission = typeof missions.$inferSelect;
export type NewMission = typeof missions.$inferInsert;
