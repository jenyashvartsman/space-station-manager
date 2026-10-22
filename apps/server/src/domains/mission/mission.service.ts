import type { Mission, MissionStatus } from '@space-station/db';

import { NotFoundError, ValidationError } from '../../shared/errors.js';
import { EventLogRepository } from '../event-log/event-log.repository.js';
import { ResourceRepository } from '../resource/resource.repository.js';
import { StationRepository } from '../station/station.repository.js';
import { MissionRepository } from './mission.repository.js';
import type { CreateMissionBody, UpdateMissionBody } from './mission.types.js';

async function applyRewards(mission: Mission): Promise<void> {
  const reward = mission.reward as Record<string, number> | null;
  if (!reward) return;

  const resources = await ResourceRepository.findAll();
  for (const [resourceType, delta] of Object.entries(reward)) {
    const resource = resources.find((r) => r.type === resourceType);
    if (resource) {
      const newCurrent = Math.min(resource.current + delta, resource.capacity);
      await ResourceRepository.updateCurrent(resource.id, newCurrent);
    }
  }
}

export const MissionService = {
  async getAllMissions(status?: MissionStatus): Promise<Mission[]> {
    return MissionRepository.findAll(status);
  },

  async getMission(id: string): Promise<Mission> {
    const mission = await MissionRepository.findById(id);
    if (!mission) {
      throw new NotFoundError(`Mission ${id} not found`);
    }
    return mission;
  },

  async createMission(body: CreateMissionBody): Promise<Mission> {
    const station = await StationRepository.findFirst();
    if (!station) {
      throw new NotFoundError('Station not found');
    }

    return MissionRepository.create({
      stationId: station.id,
      title: body.title,
      description: body.description ?? '',
      durationSeconds: body.durationSeconds,
      reward: body.reward ?? null,
    });
  },

  async updateMissionStatus(id: string, body: UpdateMissionBody): Promise<Mission> {
    const mission = await MissionRepository.findById(id);
    if (!mission) {
      throw new NotFoundError(`Mission ${id} not found`);
    }

    const { status } = body;

    if (status === 'active') {
      if (mission.status !== 'queued') {
        throw new ValidationError('Only queued missions can be activated');
      }
      const updated = await MissionRepository.update(id, {
        status: 'active',
        startedAt: new Date(),
      });
      return updated!;
    }

    if (status === 'complete') {
      if (mission.status !== 'active') {
        throw new ValidationError('Only active missions can be completed');
      }
      const updated = await MissionRepository.update(id, {
        status: 'complete',
        completedAt: new Date(),
      });
      await applyRewards(mission);
      await EventLogRepository.create({
        stationId: mission.stationId,
        type: 'mission_complete',
        message: `Mission "${mission.title}" completed successfully`,
        payload: { missionId: mission.id },
      });
      return updated!;
    }

    if (status === 'failed') {
      if (mission.status !== 'active') {
        throw new ValidationError('Only active missions can be failed');
      }
      const updated = await MissionRepository.update(id, {
        status: 'failed',
        completedAt: new Date(),
      });
      await EventLogRepository.create({
        stationId: mission.stationId,
        type: 'mission_failed',
        message: `Mission "${mission.title}" has failed`,
        payload: { missionId: mission.id },
      });
      return updated!;
    }

    throw new ValidationError(`Invalid status: ${status}`);
  },
};
