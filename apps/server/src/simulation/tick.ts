import { db, schema } from '@space-station/db';

import { MissionRepository } from '../domains/mission/mission.repository.js';
import { MissionService } from '../domains/mission/mission.service.js';
import { ResourceRepository } from '../domains/resource/resource.repository.js';

const TICK_INTERVAL_MS = 5000;

export function applyConsumption(current: number, consumptionRate: number, capacity: number): number {
  const next = current - consumptionRate;
  return Math.min(Math.max(next, 0), capacity);
}

async function runTick(): Promise<void> {
  const resources = await ResourceRepository.findAll();

  for (const resource of resources) {
    const updated = applyConsumption(resource.current, resource.consumptionRate, resource.capacity);
    await ResourceRepository.updateCurrent(resource.id, updated);

    if (updated === 0 && resource.current > 0) {
      await db.insert(schema.eventLog).values({
        stationId: resource.stationId,
        type: 'resource_depleted',
        message: `${resource.type} has been fully depleted`,
        payload: { resourceId: resource.id, resourceType: resource.type },
      });
    }
  }

  const activeMissions = await MissionRepository.findActive();
  const now = new Date();

  for (const mission of activeMissions) {
    if (!mission.startedAt) continue;
    const elapsedSeconds = (now.getTime() - mission.startedAt.getTime()) / 1000;
    if (elapsedSeconds >= mission.durationSeconds) {
      await MissionService.updateMissionStatus(mission.id, { status: 'complete' });
    }
  }
}

export function startSimulationTick(): void {
  setInterval(() => {
    runTick().catch((err: unknown) => {
      console.error('[simulation] tick error:', err); // eslint-disable-line no-console
    });
  }, TICK_INTERVAL_MS);
}
