import { db } from '../connection';
import { station } from '../schema/station.schema';

export async function seedStation() {
  const [stationRecord] = await db
    .insert(station)
    .values({ name: 'Kepler Station Alpha' })
    .returning();
  return stationRecord;
}
