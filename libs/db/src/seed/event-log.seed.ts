import { db } from '../connection';
import { eventLog } from '../schema/event-log.schema';

export async function seedEventLog(stationId: string) {
  const now = new Date();
  const minutesAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000);
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);

  const eventData = [
    {
      stationId,
      type: 'alert',
      message: 'Power fluctuation detected in Power Core. Output unstable.',
      payload: { severity: 'warning', moduleId: 'power_core' },
      createdAt: minutesAgo(5),
    },
    {
      stationId,
      type: 'mission_complete',
      message: 'Mission "Supply Run" completed successfully.',
      payload: { missionTitle: 'Supply Run', rewards: { food: 80, water: 60 } },
      createdAt: hoursAgo(2),
    },
    {
      stationId,
      type: 'crew_injured',
      message: 'Eng. Reyes sustained injuries during a maintenance operation.',
      payload: { crewName: 'Eng. Reyes', healthBefore: 85, healthAfter: 60 },
      createdAt: hoursAgo(4),
    },
    {
      stationId,
      type: 'module_offline',
      message: 'Medical Bay has gone offline. Maintenance required.',
      payload: { moduleName: 'Medical Bay', moduleType: 'medical' },
      createdAt: hoursAgo(6),
    },
    {
      stationId,
      type: 'resource_low',
      message: 'Fuel reserves below 60% capacity. Consider scheduling a Supply Run mission.',
      payload: { resourceType: 'fuel', current: 290, capacity: 500, percentRemaining: 58 },
      createdAt: hoursAgo(8),
    },
    {
      stationId,
      type: 'crew_status_change',
      message: 'Dr. Petrov has entered resting status after extended shift.',
      payload: { crewName: 'Dr. Petrov', previousStatus: 'active', newStatus: 'resting' },
      createdAt: hoursAgo(12),
    },
    {
      stationId,
      type: 'crew_status_change',
      message: 'Lt. Sato has returned to active duty.',
      payload: { crewName: 'Lt. Sato', previousStatus: 'resting', newStatus: 'active' },
      createdAt: hoursAgo(18),
    },
    {
      stationId,
      type: 'system_startup',
      message: 'Kepler Station Alpha systems initialized. All primary systems nominal.',
      payload: { version: '1.0.0', modulesOnline: 5 },
      createdAt: hoursAgo(24),
    },
  ];

  await db.insert(eventLog).values(eventData);
}
