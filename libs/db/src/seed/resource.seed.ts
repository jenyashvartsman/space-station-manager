import { db } from '../connection';
import { resources } from '../schema/resource.schema';

export async function seedResources(stationId: string) {
  const resourceData = [
    { stationId, type: 'oxygen' as const, current: 850, capacity: 1000, consumptionRate: 2.5 },
    { stationId, type: 'power' as const, current: 620, capacity: 800, consumptionRate: 18.0 },
    { stationId, type: 'food' as const, current: 430, capacity: 600, consumptionRate: 1.2 },
    { stationId, type: 'fuel' as const, current: 290, capacity: 500, consumptionRate: 0.8 },
    { stationId, type: 'water' as const, current: 710, capacity: 900, consumptionRate: 1.8 },
  ];

  await db.insert(resources).values(resourceData);
}
