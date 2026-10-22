import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ResourceType } from '@space-station/db';
import { NotFoundError, ValidationError } from '../../shared/errors.js';
import { EventLogRepository } from '../event-log/event-log.repository.js';
import { ResourceRepository } from '../resource/resource.repository.js';
import { StationRepository } from '../station/station.repository.js';
import { MissionRepository } from './mission.repository.js';
import { MissionService } from './mission.service.js';

vi.mock('./mission.repository.js');
vi.mock('../station/station.repository.js');
vi.mock('../resource/resource.repository.js');
vi.mock('../event-log/event-log.repository.js');

const mockStation = {
  id: 'station-uuid-1',
  name: 'Alpha Station',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

const mockQueuedMission = {
  id: 'mission-uuid-1',
  stationId: 'station-uuid-1',
  title: 'Asteroid Survey',
  description: 'Survey the asteroid belt.',
  status: 'queued' as const,
  durationSeconds: 3600,
  startedAt: null,
  completedAt: null,
  reward: { fuel: 20 },
};

const mockActiveMission = {
  ...mockQueuedMission,
  id: 'mission-uuid-2',
  status: 'active' as const,
  startedAt: new Date('2026-10-22T10:00:00Z'),
};

const mockResources = [
  {
    id: 'res-1',
    stationId: 'station-uuid-1',
    type: 'fuel' as ResourceType,
    current: 50,
    capacity: 100,
    consumptionRate: 1,
    updatedAt: new Date('2026-01-01'),
  },
];

const mockEvent = {
  id: 'event-uuid-1',
  stationId: 'station-uuid-1',
  type: 'mission_complete',
  message: 'Mission completed',
  payload: {},
  createdAt: new Date('2026-10-22T10:00:00Z'),
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('MissionService.getAllMissions', () => {
  it('returns all missions', async () => {
    vi.mocked(MissionRepository.findAll).mockResolvedValue([mockQueuedMission]);
    const result = await MissionService.getAllMissions();
    expect(result).toEqual([mockQueuedMission]);
    expect(MissionRepository.findAll).toHaveBeenCalledWith(undefined);
  });

  it('filters by status when provided', async () => {
    vi.mocked(MissionRepository.findAll).mockResolvedValue([mockActiveMission]);
    const result = await MissionService.getAllMissions('active');
    expect(result).toEqual([mockActiveMission]);
    expect(MissionRepository.findAll).toHaveBeenCalledWith('active');
  });

  it('returns empty array when no missions exist', async () => {
    vi.mocked(MissionRepository.findAll).mockResolvedValue([]);
    const result = await MissionService.getAllMissions();
    expect(result).toEqual([]);
  });
});

describe('MissionService.getMission', () => {
  it('returns mission when found', async () => {
    vi.mocked(MissionRepository.findById).mockResolvedValue(mockQueuedMission);
    const result = await MissionService.getMission('mission-uuid-1');
    expect(result).toEqual(mockQueuedMission);
  });

  it('throws NotFoundError when mission does not exist', async () => {
    vi.mocked(MissionRepository.findById).mockResolvedValue(undefined);
    await expect(MissionService.getMission('nonexistent')).rejects.toThrow(NotFoundError);
  });
});

describe('MissionService.createMission', () => {
  it('creates a queued mission with station id', async () => {
    vi.mocked(StationRepository.findFirst).mockResolvedValue(mockStation);
    vi.mocked(MissionRepository.create).mockResolvedValue(mockQueuedMission);

    const result = await MissionService.createMission({
      title: 'Asteroid Survey',
      durationSeconds: 3600,
      reward: { fuel: 20 },
    });

    expect(result).toEqual(mockQueuedMission);
    expect(MissionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        stationId: 'station-uuid-1',
        title: 'Asteroid Survey',
        durationSeconds: 3600,
      }),
    );
  });

  it('defaults description to empty string when omitted', async () => {
    vi.mocked(StationRepository.findFirst).mockResolvedValue(mockStation);
    vi.mocked(MissionRepository.create).mockResolvedValue(mockQueuedMission);

    await MissionService.createMission({ title: 'Test', durationSeconds: 60 });

    expect(MissionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ description: '' }),
    );
  });

  it('throws NotFoundError when station not found', async () => {
    vi.mocked(StationRepository.findFirst).mockResolvedValue(undefined);
    await expect(
      MissionService.createMission({ title: 'Test', durationSeconds: 60 }),
    ).rejects.toThrow(NotFoundError);
  });
});

describe('MissionService.updateMissionStatus', () => {
  it('activates a queued mission and sets startedAt', async () => {
    const activated = { ...mockQueuedMission, status: 'active' as const, startedAt: new Date() };
    vi.mocked(MissionRepository.findById).mockResolvedValue(mockQueuedMission);
    vi.mocked(MissionRepository.update).mockResolvedValue(activated);

    const result = await MissionService.updateMissionStatus('mission-uuid-1', {
      status: 'active',
    });

    expect(result.status).toBe('active');
    expect(MissionRepository.update).toHaveBeenCalledWith(
      'mission-uuid-1',
      expect.objectContaining({ status: 'active', startedAt: expect.any(Date) }),
    );
  });

  it('throws ValidationError when activating a non-queued mission', async () => {
    vi.mocked(MissionRepository.findById).mockResolvedValue(mockActiveMission);
    await expect(
      MissionService.updateMissionStatus('mission-uuid-2', { status: 'active' }),
    ).rejects.toThrow(ValidationError);
  });

  it('completes an active mission, applies rewards, and logs event', async () => {
    const completed = { ...mockActiveMission, status: 'complete' as const, completedAt: new Date() };
    vi.mocked(MissionRepository.findById).mockResolvedValue(mockActiveMission);
    vi.mocked(MissionRepository.update).mockResolvedValue(completed);
    vi.mocked(ResourceRepository.findAll).mockResolvedValue(mockResources);
    vi.mocked(ResourceRepository.updateCurrent).mockResolvedValue(undefined);
    vi.mocked(EventLogRepository.create).mockResolvedValue(mockEvent);

    const result = await MissionService.updateMissionStatus('mission-uuid-2', {
      status: 'complete',
    });

    expect(result.status).toBe('complete');
    expect(ResourceRepository.findAll).toHaveBeenCalled();
    expect(ResourceRepository.updateCurrent).toHaveBeenCalledWith('res-1', 70);
    expect(EventLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'mission_complete' }),
    );
  });

  it('caps reward at resource capacity', async () => {
    const missionWithLargeReward = { ...mockActiveMission, reward: { fuel: 200 } };
    const completed = { ...missionWithLargeReward, status: 'complete' as const, completedAt: new Date() };
    vi.mocked(MissionRepository.findById).mockResolvedValue(missionWithLargeReward);
    vi.mocked(MissionRepository.update).mockResolvedValue(completed);
    vi.mocked(ResourceRepository.findAll).mockResolvedValue(mockResources);
    vi.mocked(ResourceRepository.updateCurrent).mockResolvedValue(undefined);
    vi.mocked(EventLogRepository.create).mockResolvedValue(mockEvent);

    await MissionService.updateMissionStatus('mission-uuid-2', { status: 'complete' });

    expect(ResourceRepository.updateCurrent).toHaveBeenCalledWith('res-1', 100);
  });

  it('fails an active mission and logs event', async () => {
    const failed = { ...mockActiveMission, status: 'failed' as const, completedAt: new Date() };
    vi.mocked(MissionRepository.findById).mockResolvedValue(mockActiveMission);
    vi.mocked(MissionRepository.update).mockResolvedValue(failed);
    vi.mocked(EventLogRepository.create).mockResolvedValue({ ...mockEvent, type: 'mission_failed' });

    const result = await MissionService.updateMissionStatus('mission-uuid-2', {
      status: 'failed',
    });

    expect(result.status).toBe('failed');
    expect(EventLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'mission_failed' }),
    );
    expect(ResourceRepository.findAll).not.toHaveBeenCalled();
  });

  it('throws ValidationError when completing a non-active mission', async () => {
    vi.mocked(MissionRepository.findById).mockResolvedValue(mockQueuedMission);
    await expect(
      MissionService.updateMissionStatus('mission-uuid-1', { status: 'complete' }),
    ).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError when failing a non-active mission', async () => {
    vi.mocked(MissionRepository.findById).mockResolvedValue(mockQueuedMission);
    await expect(
      MissionService.updateMissionStatus('mission-uuid-1', { status: 'failed' }),
    ).rejects.toThrow(ValidationError);
  });

  it('throws NotFoundError when mission does not exist', async () => {
    vi.mocked(MissionRepository.findById).mockResolvedValue(undefined);
    await expect(
      MissionService.updateMissionStatus('nonexistent', { status: 'active' }),
    ).rejects.toThrow(NotFoundError);
  });
});
