import { doublePrecision, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { station } from './station.schema';

export type ResourceType = 'oxygen' | 'power' | 'food' | 'fuel' | 'water';

export const resources = pgTable(
  'resources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    stationId: uuid('station_id')
      .notNull()
      .references(() => station.id),
    type: text('type').$type<ResourceType>().notNull(),
    current: doublePrecision('current').notNull().default(0),
    capacity: doublePrecision('capacity').notNull().default(0),
    consumptionRate: doublePrecision('consumption_rate').notNull().default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    stationTypeIdx: index('resources_station_type_idx').on(table.stationId, table.type),
  }),
);

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
