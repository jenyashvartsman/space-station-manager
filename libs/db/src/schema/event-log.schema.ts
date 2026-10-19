import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { station } from './station.schema';

export const eventLog = pgTable(
  'event_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    stationId: uuid('station_id')
      .notNull()
      .references(() => station.id),
    type: text('type').notNull(),
    message: text('message').notNull(),
    payload: jsonb('payload'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    stationCreatedAtIdx: index('event_log_station_created_at_idx').on(
      table.stationId,
      table.createdAt,
    ),
  }),
);

export type EventLog = typeof eventLog.$inferSelect;
export type NewEventLog = typeof eventLog.$inferInsert;
