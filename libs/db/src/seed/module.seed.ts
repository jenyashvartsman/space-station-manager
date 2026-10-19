import { db } from '../connection';
import { modules } from '../schema/module.schema';

export async function seedModules(stationId: string) {
  const moduleData = [
    { stationId, name: 'Life Support Alpha', type: 'life_support', status: 'nominal' as const, powerConsumption: 12.5 },
    { stationId, name: 'Research Lab', type: 'lab', status: 'nominal' as const, powerConsumption: 8.0 },
    { stationId, name: 'Docking Bay 1', type: 'docking', status: 'nominal' as const, powerConsumption: 4.0 },
    { stationId, name: 'Power Core', type: 'power_core', status: 'warning' as const, powerConsumption: 22.0 },
    { stationId, name: 'Habitation Ring', type: 'habitation', status: 'nominal' as const, powerConsumption: 6.5 },
    { stationId, name: 'Medical Bay', type: 'medical', status: 'offline' as const, powerConsumption: 0.0 },
  ];

  const inserted = await db.insert(modules).values(moduleData).returning();

  return new Map(inserted.map((m) => [m.name, m.id]));
}
