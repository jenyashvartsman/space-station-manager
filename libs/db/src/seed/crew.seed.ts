import { db } from '../connection';
import { crewMembers } from '../schema/crew.schema';

export async function seedCrew(stationId: string, moduleByName: Map<string, string>) {
  const crewData = [
    {
      stationId,
      name: 'Dr. Elena Vasquez',
      role: 'scientist',
      health: 95,
      status: 'active' as const,
      assignedModuleId: moduleByName.get('Research Lab') ?? null,
    },
    {
      stationId,
      name: 'Chief Okonkwo',
      role: 'engineer',
      health: 88,
      status: 'active' as const,
      assignedModuleId: moduleByName.get('Power Core') ?? null,
    },
    {
      stationId,
      name: 'Lt. Sato',
      role: 'pilot',
      health: 100,
      status: 'active' as const,
      assignedModuleId: moduleByName.get('Docking Bay 1') ?? null,
    },
    {
      stationId,
      name: 'Dr. Petrov',
      role: 'medic',
      health: 72,
      status: 'resting' as const,
      assignedModuleId: null,
    },
    {
      stationId,
      name: 'Eng. Reyes',
      role: 'engineer',
      health: 60,
      status: 'injured' as const,
      assignedModuleId: null,
    },
  ];

  await db.insert(crewMembers).values(crewData);
}
