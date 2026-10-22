import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotFoundError } from '../../shared/errors.js';
import { StationRepository } from './station.repository.js';
import { StationService } from './station.service.js';

vi.mock('./station.repository.js');

const mockStation = {
  id: 'station-uuid-1',
  name: 'Alpha Station',
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('StationService.getStation', () => {
  it('returns station when found', async () => {
    vi.mocked(StationRepository.findFirst).mockResolvedValue(mockStation);
    const result = await StationService.getStation();
    expect(result).toEqual(mockStation);
  });

  it('throws NotFoundError when no station exists', async () => {
    vi.mocked(StationRepository.findFirst).mockResolvedValue(undefined);
    await expect(StationService.getStation()).rejects.toThrow(NotFoundError);
  });
});

describe('StationService.updateStation', () => {
  it('returns existing station when no name provided', async () => {
    vi.mocked(StationRepository.findFirst).mockResolvedValue(mockStation);
    const result = await StationService.updateStation({});
    expect(result).toEqual(mockStation);
    expect(StationRepository.update).not.toHaveBeenCalled();
  });

  it('updates and returns station when name provided', async () => {
    const updated = { ...mockStation, name: 'New Name' };
    vi.mocked(StationRepository.findFirst).mockResolvedValue(mockStation);
    vi.mocked(StationRepository.update).mockResolvedValue(updated);
    const result = await StationService.updateStation({ name: 'New Name' });
    expect(result.name).toBe('New Name');
    expect(StationRepository.update).toHaveBeenCalledWith(
      mockStation.id,
      expect.objectContaining({ name: 'New Name' }),
    );
  });

  it('throws NotFoundError when no station exists', async () => {
    vi.mocked(StationRepository.findFirst).mockResolvedValue(undefined);
    await expect(StationService.updateStation({ name: 'Test' })).rejects.toThrow(NotFoundError);
  });
});
