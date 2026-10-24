import { sql } from 'drizzle-orm';
import { db } from '../connection';
import * as schema from '../schema/index';

export async function runSeed(): Promise<void> {
  // Drop all tables with CASCADE — no dependency ordering needed
  await db.execute(sql.raw('DROP TABLE IF EXISTS event_log CASCADE'));
  await db.execute(sql.raw('DROP TABLE IF EXISTS missions CASCADE'));
  await db.execute(sql.raw('DROP TABLE IF EXISTS resources CASCADE'));
  await db.execute(sql.raw('DROP TABLE IF EXISTS crew_members CASCADE'));
  await db.execute(sql.raw('DROP TABLE IF EXISTS modules CASCADE'));
  await db.execute(sql.raw('DROP TABLE IF EXISTS station CASCADE'));
  await db.execute(sql.raw('DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE'));

  // Recreate schema inline — bypasses Drizzle migrate() entirely
  await db.execute(sql.raw(`
    CREATE TABLE "station" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" text NOT NULL,
      "created_at" timestamptz DEFAULT now() NOT NULL,
      "updated_at" timestamptz DEFAULT now() NOT NULL
    )
  `));

  await db.execute(sql.raw(`
    CREATE TABLE "modules" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "station_id" uuid NOT NULL REFERENCES station(id),
      "type" text NOT NULL,
      "name" text NOT NULL,
      "status" text DEFAULT 'nominal' NOT NULL,
      "power_consumption" double precision DEFAULT 0 NOT NULL,
      "created_at" timestamptz DEFAULT now() NOT NULL
    )
  `));

  await db.execute(sql.raw(`
    CREATE TABLE "crew_members" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "station_id" uuid NOT NULL REFERENCES station(id),
      "name" text NOT NULL,
      "role" text NOT NULL,
      "health" integer DEFAULT 100 NOT NULL,
      "status" text DEFAULT 'active' NOT NULL,
      "assigned_module_id" uuid REFERENCES modules(id)
    )
  `));

  await db.execute(sql.raw(`
    CREATE TABLE "resources" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "station_id" uuid NOT NULL REFERENCES station(id),
      "type" text NOT NULL,
      "current" double precision DEFAULT 0 NOT NULL,
      "capacity" double precision DEFAULT 0 NOT NULL,
      "consumption_rate" double precision DEFAULT 0 NOT NULL,
      "updated_at" timestamptz DEFAULT now() NOT NULL
    )
  `));

  await db.execute(sql.raw(`
    CREATE INDEX "resources_station_type_idx" ON resources (station_id, type)
  `));

  await db.execute(sql.raw(`
    CREATE TABLE "missions" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "station_id" uuid NOT NULL REFERENCES station(id),
      "title" text NOT NULL,
      "description" text NOT NULL,
      "status" text DEFAULT 'queued' NOT NULL,
      "duration_seconds" integer DEFAULT 60 NOT NULL,
      "started_at" timestamptz,
      "completed_at" timestamptz,
      "reward" jsonb
    )
  `));

  await db.execute(sql.raw(`
    CREATE INDEX "missions_station_status_idx" ON missions (station_id, status)
  `));

  await db.execute(sql.raw(`
    CREATE TABLE "event_log" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "station_id" uuid NOT NULL REFERENCES station(id),
      "type" text NOT NULL,
      "message" text NOT NULL,
      "payload" jsonb,
      "created_at" timestamptz DEFAULT now() NOT NULL
    )
  `));

  await db.execute(sql.raw(`
    CREATE INDEX "event_log_station_created_at_idx" ON event_log (station_id, created_at)
  `));

  // Station
  const [stationRecord] = await db
    .insert(schema.station)
    .values({ name: 'Kepler Station Alpha' })
    .returning();

  // Modules
  const insertedModules = await db
    .insert(schema.modules)
    .values([
      { stationId: stationRecord.id, name: 'Life Support Alpha', type: 'life_support', status: 'nominal', powerConsumption: 12.5 },
      { stationId: stationRecord.id, name: 'Research Lab',        type: 'lab',          status: 'nominal', powerConsumption: 8.0  },
      { stationId: stationRecord.id, name: 'Docking Bay 1',       type: 'docking',      status: 'nominal', powerConsumption: 4.0  },
      { stationId: stationRecord.id, name: 'Power Core',          type: 'power_core',   status: 'warning', powerConsumption: 22.0 },
      { stationId: stationRecord.id, name: 'Habitation Ring',     type: 'habitation',   status: 'nominal', powerConsumption: 6.5  },
      { stationId: stationRecord.id, name: 'Medical Bay',         type: 'medical',      status: 'offline', powerConsumption: 0.0  },
    ])
    .returning();

  const moduleByName = new Map(insertedModules.map((m) => [m.name, m.id]));

  // Crew
  await db.insert(schema.crewMembers).values([
    { stationId: stationRecord.id, name: 'Dr. Elena Vasquez', role: 'scientist', health: 95,  status: 'active',  assignedModuleId: moduleByName.get('Research Lab') ?? null },
    { stationId: stationRecord.id, name: 'Chief Okonkwo',     role: 'engineer',  health: 88,  status: 'active',  assignedModuleId: moduleByName.get('Power Core')   ?? null },
    { stationId: stationRecord.id, name: 'Lt. Sato',          role: 'pilot',     health: 100, status: 'active',  assignedModuleId: moduleByName.get('Docking Bay 1') ?? null },
    { stationId: stationRecord.id, name: 'Dr. Petrov',        role: 'medic',     health: 72,  status: 'resting', assignedModuleId: null },
    { stationId: stationRecord.id, name: 'Eng. Reyes',        role: 'engineer',  health: 60,  status: 'injured', assignedModuleId: null },
  ]);

  // Resources
  await db.insert(schema.resources).values([
    { stationId: stationRecord.id, type: 'oxygen', current: 850, capacity: 1000, consumptionRate: 2.5  },
    { stationId: stationRecord.id, type: 'power',  current: 620, capacity: 800,  consumptionRate: 18.0 },
    { stationId: stationRecord.id, type: 'food',   current: 430, capacity: 600,  consumptionRate: 1.2  },
    { stationId: stationRecord.id, type: 'fuel',   current: 290, capacity: 500,  consumptionRate: 0.8  },
    { stationId: stationRecord.id, type: 'water',  current: 710, capacity: 900,  consumptionRate: 1.8  },
  ]);

  // Missions
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const yesterday   = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  await db.insert(schema.missions).values([
    {
      stationId: stationRecord.id,
      title: 'Asteroid Survey',
      description: 'Survey the nearby asteroid belt for mineral deposits and potential mining sites.',
      status: 'active', durationSeconds: 7200, startedAt: twoHoursAgo, completedAt: null,
      reward: { minerals: 50, fuel: 20 },
    },
    {
      stationId: stationRecord.id,
      title: 'Solar Panel Repair',
      description: 'Repair the damaged solar panels on the outer hull to restore full power generation.',
      status: 'queued', durationSeconds: 3600, startedAt: null, completedAt: null,
      reward: { power: 100 },
    },
    {
      stationId: stationRecord.id,
      title: 'Supply Run',
      description: 'Retrieve supply canisters from the orbital depot before they drift out of range.',
      status: 'complete', durationSeconds: 1800, startedAt: yesterday, completedAt: yesterday,
      reward: { food: 80, water: 60 },
    },
  ]);

  // Event log
  const minutesAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000);
  const hoursAgo   = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);

  await db.insert(schema.eventLog).values([
    { stationId: stationRecord.id, type: 'alert',              message: 'Power fluctuation detected in Power Core. Output unstable.',            payload: { severity: 'warning', moduleId: 'power_core' },                              createdAt: minutesAgo(5)  },
    { stationId: stationRecord.id, type: 'mission_complete',   message: 'Mission "Supply Run" completed successfully.',                           payload: { missionTitle: 'Supply Run', rewards: { food: 80, water: 60 } },             createdAt: hoursAgo(2)    },
    { stationId: stationRecord.id, type: 'crew_injured',       message: 'Eng. Reyes sustained injuries during a maintenance operation.',          payload: { crewName: 'Eng. Reyes', healthBefore: 85, healthAfter: 60 },               createdAt: hoursAgo(4)    },
    { stationId: stationRecord.id, type: 'module_offline',     message: 'Medical Bay has gone offline. Maintenance required.',                   payload: { moduleName: 'Medical Bay', moduleType: 'medical' },                         createdAt: hoursAgo(6)    },
    { stationId: stationRecord.id, type: 'resource_low',       message: 'Fuel reserves below 60% capacity. Consider scheduling a Supply Run.',   payload: { resourceType: 'fuel', current: 290, capacity: 500, percentRemaining: 58 }, createdAt: hoursAgo(8)    },
    { stationId: stationRecord.id, type: 'crew_status_change', message: 'Dr. Petrov has entered resting status after extended shift.',           payload: { crewName: 'Dr. Petrov', previousStatus: 'active',  newStatus: 'resting' }, createdAt: hoursAgo(12)   },
    { stationId: stationRecord.id, type: 'crew_status_change', message: 'Lt. Sato has returned to active duty.',                                 payload: { crewName: 'Lt. Sato',   previousStatus: 'resting', newStatus: 'active'  }, createdAt: hoursAgo(18)   },
    { stationId: stationRecord.id, type: 'system_startup',     message: 'Kepler Station Alpha systems initialized. All primary systems nominal.', payload: { version: '1.0.0', modulesOnline: 5 },                                     createdAt: hoursAgo(24)   },
  ]);
}
