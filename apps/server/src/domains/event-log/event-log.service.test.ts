import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EventLogRepository } from './event-log.repository.js';
import { EventLogService } from './event-log.service.js';

vi.mock('./event-log.repository.js');

const mockEvents = [
  {
    id: 'event-uuid-1',
    stationId: 'station-uuid-1',
    type: 'mission_complete',
    message: 'Mission completed',
    payload: { missionId: 'mission-uuid-1' },
    createdAt: new Date('2026-10-22T12:00:00Z'),
  },
  {
    id: 'event-uuid-2',
    stationId: 'station-uuid-1',
    type: 'resource_depleted',
    message: 'Oxygen depleted',
    payload: null,
    createdAt: new Date('2026-10-22T11:00:00Z'),
  },
];

beforeEach(() => {
  vi.resetAllMocks();
});

describe('EventLogService.getRecentEvents', () => {
  it('returns events with default limit of 50', async () => {
    vi.mocked(EventLogRepository.getRecent).mockResolvedValue(mockEvents);
    const result = await EventLogService.getRecentEvents();
    expect(result).toEqual(mockEvents);
    expect(EventLogRepository.getRecent).toHaveBeenCalledWith(50);
  });

  it('uses provided limit', async () => {
    vi.mocked(EventLogRepository.getRecent).mockResolvedValue([mockEvents[0]!]);
    const result = await EventLogService.getRecentEvents(1);
    expect(result).toHaveLength(1);
    expect(EventLogRepository.getRecent).toHaveBeenCalledWith(1);
  });

  it('caps limit at 200', async () => {
    vi.mocked(EventLogRepository.getRecent).mockResolvedValue(mockEvents);
    await EventLogService.getRecentEvents(999);
    expect(EventLogRepository.getRecent).toHaveBeenCalledWith(200);
  });

  it('returns empty array when no events exist', async () => {
    vi.mocked(EventLogRepository.getRecent).mockResolvedValue([]);
    const result = await EventLogService.getRecentEvents();
    expect(result).toEqual([]);
  });
});
