import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ResourceRepository } from './resource.repository.js';
import { ResourceService } from './resource.service.js';

vi.mock('./resource.repository.js');

const mockResources = [
  {
    id: 'res-1',
    stationId: 'station-1',
    type: 'oxygen' as const,
    current: 80,
    capacity: 100,
    consumptionRate: 2,
    updatedAt: new Date('2026-01-01T00:00:00Z'),
  },
  {
    id: 'res-2',
    stationId: 'station-1',
    type: 'power' as const,
    current: 60,
    capacity: 100,
    consumptionRate: 5,
    updatedAt: new Date('2026-01-01T00:00:00Z'),
  },
];

beforeEach(() => {
  vi.resetAllMocks();
});

describe('ResourceService.getAllResources', () => {
  it('returns all resources', async () => {
    vi.mocked(ResourceRepository.findAll).mockResolvedValue(mockResources);
    const result = await ResourceService.getAllResources();
    expect(result).toEqual(mockResources);
    expect(result).toHaveLength(2);
  });

  it('returns empty array when no resources exist', async () => {
    vi.mocked(ResourceRepository.findAll).mockResolvedValue([]);
    const result = await ResourceService.getAllResources();
    expect(result).toEqual([]);
  });
});
