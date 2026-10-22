import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotFoundError, ValidationError } from '../../shared/errors.js';
import { ModuleRepository } from '../module/module.repository.js';
import { CrewRepository } from './crew.repository.js';
import { CrewService } from './crew.service.js';

vi.mock('./crew.repository.js');
vi.mock('../module/module.repository.js');

const mockCrewMember = {
  id: 'crew-uuid-1',
  stationId: 'station-uuid-1',
  name: 'Alex Chen',
  role: 'engineer',
  health: 95,
  status: 'active' as const,
  assignedModuleId: null,
};

const mockModule = {
  id: 'module-uuid-1',
  stationId: 'station-uuid-1',
  name: 'Engineering Bay',
  type: 'engineering',
  status: 'nominal' as const,
  powerConsumption: 10,
  createdAt: new Date('2026-01-01'),
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('CrewService.getAllCrew', () => {
  it('returns all crew with module info', async () => {
    const mockCrewWithModule = [{ ...mockCrewMember, assignedModule: null }];
    vi.mocked(CrewRepository.findAll).mockResolvedValue(mockCrewWithModule);
    const result = await CrewService.getAllCrew();
    expect(result).toEqual(mockCrewWithModule);
  });

  it('returns empty array when no crew exist', async () => {
    vi.mocked(CrewRepository.findAll).mockResolvedValue([]);
    const result = await CrewService.getAllCrew();
    expect(result).toEqual([]);
  });
});

describe('CrewService.getCrewMember', () => {
  it('returns crew member when found', async () => {
    vi.mocked(CrewRepository.findById).mockResolvedValue(mockCrewMember);
    const result = await CrewService.getCrewMember('crew-uuid-1');
    expect(result).toEqual(mockCrewMember);
  });

  it('throws NotFoundError when crew member does not exist', async () => {
    vi.mocked(CrewRepository.findById).mockResolvedValue(undefined);
    await expect(CrewService.getCrewMember('nonexistent')).rejects.toThrow(NotFoundError);
  });
});

describe('CrewService.updateCrewMember', () => {
  it('updates crew status', async () => {
    const updated = { ...mockCrewMember, status: 'resting' as const };
    vi.mocked(CrewRepository.findById).mockResolvedValue(mockCrewMember);
    vi.mocked(CrewRepository.update).mockResolvedValue(updated);
    const result = await CrewService.updateCrewMember('crew-uuid-1', { status: 'resting' });
    expect(result.status).toBe('resting');
    expect(CrewRepository.update).toHaveBeenCalledWith(
      'crew-uuid-1',
      expect.objectContaining({ status: 'resting' }),
    );
  });

  it('assigns crew to a module in the same station', async () => {
    const updated = { ...mockCrewMember, assignedModuleId: 'module-uuid-1' };
    vi.mocked(CrewRepository.findById).mockResolvedValue(mockCrewMember);
    vi.mocked(ModuleRepository.findById).mockResolvedValue(mockModule);
    vi.mocked(CrewRepository.update).mockResolvedValue(updated);
    const result = await CrewService.updateCrewMember('crew-uuid-1', {
      assignedModuleId: 'module-uuid-1',
    });
    expect(result.assignedModuleId).toBe('module-uuid-1');
    expect(ModuleRepository.findById).toHaveBeenCalledWith('module-uuid-1');
  });

  it('unassigns crew when assignedModuleId is null', async () => {
    const crewWithModule = { ...mockCrewMember, assignedModuleId: 'module-uuid-1' };
    const updated = { ...mockCrewMember, assignedModuleId: null };
    vi.mocked(CrewRepository.findById).mockResolvedValue(crewWithModule);
    vi.mocked(CrewRepository.update).mockResolvedValue(updated);
    const result = await CrewService.updateCrewMember('crew-uuid-1', { assignedModuleId: null });
    expect(result.assignedModuleId).toBeNull();
    expect(ModuleRepository.findById).not.toHaveBeenCalled();
  });

  it('throws ValidationError when assigning to module in a different station', async () => {
    const differentStationModule = { ...mockModule, stationId: 'other-station-uuid' };
    vi.mocked(CrewRepository.findById).mockResolvedValue(mockCrewMember);
    vi.mocked(ModuleRepository.findById).mockResolvedValue(differentStationModule);
    await expect(
      CrewService.updateCrewMember('crew-uuid-1', { assignedModuleId: 'module-uuid-1' }),
    ).rejects.toThrow(ValidationError);
  });

  it('throws NotFoundError when module not found during assignment', async () => {
    vi.mocked(CrewRepository.findById).mockResolvedValue(mockCrewMember);
    vi.mocked(ModuleRepository.findById).mockResolvedValue(undefined);
    await expect(
      CrewService.updateCrewMember('crew-uuid-1', { assignedModuleId: 'nonexistent-module' }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws NotFoundError when crew member does not exist', async () => {
    vi.mocked(CrewRepository.findById).mockResolvedValue(undefined);
    await expect(CrewService.updateCrewMember('nonexistent', {})).rejects.toThrow(NotFoundError);
  });
});
