import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotFoundError } from '../../shared/errors.js';
import { CrewRepository } from '../crew/crew.repository.js';
import { ModuleRepository } from './module.repository.js';
import { ModuleService } from './module.service.js';

vi.mock('./module.repository.js');
vi.mock('../crew/crew.repository.js');

const mockModule = {
  id: 'module-uuid-1',
  stationId: 'station-uuid-1',
  name: 'Engineering Bay',
  type: 'engineering',
  status: 'nominal' as const,
  powerConsumption: 10,
  createdAt: new Date('2026-01-01'),
  repairing: false,
  repairProgress: 0,
};

const mockCrew = [
  {
    id: 'crew-uuid-1',
    stationId: 'station-uuid-1',
    name: 'Alex Chen',
    role: 'engineer',
    health: 95,
    status: 'active' as const,
    assignedModuleId: 'module-uuid-1',
  },
];

beforeEach(() => {
  vi.resetAllMocks();
});

describe('ModuleService.getAllModules', () => {
  it('returns all modules with crew counts', async () => {
    const mockModulesWithCount = [{ ...mockModule, crewCount: 1 }];
    vi.mocked(ModuleRepository.findAll).mockResolvedValue(mockModulesWithCount);
    const result = await ModuleService.getAllModules();
    expect(result).toEqual(mockModulesWithCount);
  });

  it('returns empty array when no modules exist', async () => {
    vi.mocked(ModuleRepository.findAll).mockResolvedValue([]);
    const result = await ModuleService.getAllModules();
    expect(result).toEqual([]);
  });
});

describe('ModuleService.getModule', () => {
  it('returns module with crew list', async () => {
    vi.mocked(ModuleRepository.findById).mockResolvedValue(mockModule);
    vi.mocked(ModuleRepository.findCrewByModuleId).mockResolvedValue(mockCrew);
    const result = await ModuleService.getModule('module-uuid-1');
    expect(result).toMatchObject({ ...mockModule, crew: mockCrew });
    expect(ModuleRepository.findCrewByModuleId).toHaveBeenCalledWith('module-uuid-1');
  });

  it('throws NotFoundError for a non-existent module', async () => {
    vi.mocked(ModuleRepository.findById).mockResolvedValue(undefined);
    await expect(ModuleService.getModule('nonexistent')).rejects.toThrow(NotFoundError);
  });
});

describe('ModuleService.updateModule', () => {
  it('updates module name', async () => {
    const updated = { ...mockModule, name: 'New Name' };
    vi.mocked(ModuleRepository.findById).mockResolvedValue(mockModule);
    vi.mocked(ModuleRepository.update).mockResolvedValue(updated);
    vi.mocked(ModuleRepository.findCrewByModuleId).mockResolvedValue([]);
    const result = await ModuleService.updateModule('module-uuid-1', { name: 'New Name' });
    expect(result.name).toBe('New Name');
    expect(CrewRepository.setStatusByModuleId).not.toHaveBeenCalled();
  });

  it('sets assigned crew to resting when module transitions to offline', async () => {
    const updated = { ...mockModule, status: 'offline' as const };
    vi.mocked(ModuleRepository.findById).mockResolvedValue(mockModule);
    vi.mocked(ModuleRepository.update).mockResolvedValue(updated);
    vi.mocked(ModuleRepository.findCrewByModuleId).mockResolvedValue([]);
    await ModuleService.updateModule('module-uuid-1', { status: 'offline' });
    expect(CrewRepository.setStatusByModuleId).toHaveBeenCalledWith('module-uuid-1', 'resting');
  });

  it('does not set crew to resting when module is already offline', async () => {
    const offlineModule = { ...mockModule, status: 'offline' as const };
    vi.mocked(ModuleRepository.findById).mockResolvedValue(offlineModule);
    vi.mocked(ModuleRepository.update).mockResolvedValue(offlineModule);
    vi.mocked(ModuleRepository.findCrewByModuleId).mockResolvedValue([]);
    await ModuleService.updateModule('module-uuid-1', { status: 'offline' });
    expect(CrewRepository.setStatusByModuleId).not.toHaveBeenCalled();
  });

  it('throws NotFoundError when module does not exist', async () => {
    vi.mocked(ModuleRepository.findById).mockResolvedValue(undefined);
    await expect(ModuleService.updateModule('nonexistent', {})).rejects.toThrow(NotFoundError);
  });
});
