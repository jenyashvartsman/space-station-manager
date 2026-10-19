import 'dotenv/config';
import path from 'path';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '../connection';
import { seedStation } from './station.seed';
import { seedModules } from './module.seed';
import { seedCrew } from './crew.seed';
import { seedResources } from './resource.seed';
import { seedMissions } from './mission.seed';
import { seedEventLog } from './event-log.seed';

async function seed() {
  console.log('Dropping tables...');
  await db.execute(sql`DROP TABLE IF EXISTS event_log`);
  await db.execute(sql`DROP TABLE IF EXISTS missions`);
  await db.execute(sql`DROP TABLE IF EXISTS resources`);
  await db.execute(sql`DROP TABLE IF EXISTS crew_members`);
  await db.execute(sql`DROP TABLE IF EXISTS modules`);
  await db.execute(sql`DROP TABLE IF EXISTS station`);
  await db.execute(sql`DROP TABLE IF EXISTS __drizzle_migrations`);

  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: path.join(process.cwd(), 'src/migrations') });

  console.log('Seeding station...');
  const stationRecord = await seedStation();

  console.log('Seeding modules...');
  const moduleByName = await seedModules(stationRecord.id);

  console.log('Seeding crew...');
  await seedCrew(stationRecord.id, moduleByName);

  console.log('Seeding resources...');
  await seedResources(stationRecord.id);

  console.log('Seeding missions...');
  await seedMissions(stationRecord.id);

  console.log('Seeding event log...');
  await seedEventLog(stationRecord.id);

  console.log('✓ Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
