import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const station = pgTable('station', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Station = typeof station.$inferSelect;
export type NewStation = typeof station.$inferInsert;
