import { db } from '../connection';
import { missions } from '../schema/mission.schema';

export async function seedMissions(stationId: string) {
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const missionData = [
    {
      stationId,
      title: 'Asteroid Survey',
      description: 'Survey the nearby asteroid belt for mineral deposits and potential mining sites.',
      status: 'active' as const,
      durationSeconds: 7200,
      startedAt: twoHoursAgo,
      completedAt: null,
      reward: { minerals: 50, fuel: 20 },
    },
    {
      stationId,
      title: 'Solar Panel Repair',
      description: 'Repair the damaged solar panels on the outer hull to restore full power generation.',
      status: 'queued' as const,
      durationSeconds: 3600,
      startedAt: null,
      completedAt: null,
      reward: { power: 100 },
    },
    {
      stationId,
      title: 'Supply Run',
      description: 'Retrieve supply canisters from the orbital depot before they drift out of range.',
      status: 'complete' as const,
      durationSeconds: 1800,
      startedAt: yesterday,
      completedAt: yesterday,
      reward: { food: 80, water: 60 },
    },
  ];

  await db.insert(missions).values(missionData);
}
