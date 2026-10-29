import { db, schema } from '@space-station/db';
import type { ModuleStatus } from '@space-station/db';

import { CrewRepository } from '../domains/crew/crew.repository.js';
import { EventLogRepository } from '../domains/event-log/event-log.repository.js';
import { MissionRepository } from '../domains/mission/mission.repository.js';
import { MissionService } from '../domains/mission/mission.service.js';
import { ModuleRepository } from '../domains/module/module.repository.js';
import { ResourceRepository } from '../domains/resource/resource.repository.js';

const TICK_INTERVAL_MS = 5000;
const REPAIR_PROGRESS_PER_TICK = 100 / 3; // ~33 per tick → ~15s per status step (3 × 5s ticks)
const HEALTH_RECOVERY_PER_TICK = 25;      // 4 ticks → ~20s to full health

const MODULE_REPAIR_STEPS: ModuleStatus[] = ['offline', 'critical', 'warning', 'nominal'];

export function applyConsumption(current: number, consumptionRate: number, capacity: number): number {
  const next = current - consumptionRate;
  return Math.min(Math.max(next, 0), capacity);
}

export function advanceRepair(progress: number): number {
  return progress + REPAIR_PROGRESS_PER_TICK;
}

export function advanceHealing(health: number): number {
  return Math.min(health + HEALTH_RECOVERY_PER_TICK, 100);
}

function repairStep(status: ModuleStatus): ModuleStatus {
  const idx = MODULE_REPAIR_STEPS.indexOf(status);
  return MODULE_REPAIR_STEPS[Math.min(idx + 1, MODULE_REPAIR_STEPS.length - 1)] ?? 'nominal';
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

  const repairingModules = await ModuleRepository.findRepairing();

  for (const mod of repairingModules) {
    const newProgress = advanceRepair(mod.repairProgress);

    if (newProgress >= 100) {
      const newStatus = repairStep(mod.status);

      if (newStatus === 'nominal') {
        await ModuleRepository.update(mod.id, { status: 'nominal', repairing: false, repairProgress: 0 });
        await CrewRepository.setStatusByModuleId(mod.id, 'resting');
        await EventLogRepository.create({
          stationId: mod.stationId,
          type: 'module.repair_complete',
          message: `${mod.name} has been fully repaired`,
          payload: { moduleId: mod.id },
        });
      } else {
        await ModuleRepository.update(mod.id, { status: newStatus, repairProgress: 0 });
        await EventLogRepository.create({
          stationId: mod.stationId,
          type: 'module.repair_progress',
          message: `${mod.name} repaired: ${mod.status} → ${newStatus}`,
          payload: { moduleId: mod.id, from: mod.status, to: newStatus },
        });
      }
    } else {
      await ModuleRepository.update(mod.id, { repairProgress: Math.round(newProgress) });
    }
  }

  // Healing loop — medic assigned to a nominal medical module heals all injured crew
  const medicalModules = await ModuleRepository.findNominalMedical();
  const healedStations = new Set<string>();

  for (const medMod of medicalModules) {
    if (healedStations.has(medMod.stationId)) continue;
    const assignedCrew = await ModuleRepository.findCrewByModuleId(medMod.id);
    const hasMedic = assignedCrew.some((c) => c.role.toLowerCase() === 'medic');
    if (!hasMedic) continue;

    healedStations.add(medMod.stationId);
    const injuredCrew = await CrewRepository.findInjuredByStationId(medMod.stationId);

    for (const crew of injuredCrew) {
      const newHealth = advanceHealing(crew.health);
      if (newHealth >= 100) {
        await CrewRepository.update(crew.id, { health: 100, status: 'active' });
        await EventLogRepository.create({
          stationId: crew.stationId,
          type: 'crew.healed',
          message: `${crew.name} has fully recovered`,
          payload: { crewId: crew.id },
        });
      } else {
        await CrewRepository.update(crew.id, { health: newHealth });
      }
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
