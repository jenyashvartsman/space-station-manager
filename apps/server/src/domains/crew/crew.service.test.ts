import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotFoundError, ValidationError } from '../../shared/errors.js';
import { EventLogRepository } from '../event-log/event-log.repository.js';
import { ModuleRepository } from '../module/module.repository.js';
import { CrewRepository } from './crew.repository.js';
import { CrewService } from './crew.service.js';

vi.mock('./crew.repository.js');
vi.mock('../module/module.repository.js');
vi.mock('../event-log/event-log.repository.js');

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
  repairing: false,
  repairProgress: 0,
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

  describe('engineer repair mechanic', () => {
    it('starts repair when engineer is assigned to a damaged module', async () => {
      const criticalModule = { ...mockModule, status: 'critical' as const };
      const updated = { ...mockCrewMember, assignedModuleId: 'module-uuid-1' };
      vi.mocked(CrewRepository.findById).mockResolvedValue(mockCrewMember);
      vi.mocked(ModuleRepository.findById).mockResolvedValue(criticalModule);
      vi.mocked(ModuleRepository.update).mockResolvedValue(criticalModule);
      vi.mocked(EventLogRepository.create).mockResolvedValue({} as never);
      vi.mocked(CrewRepository.update).mockResolvedValue(updated);

      await CrewService.updateCrewMember('crew-uuid-1', { assignedModuleId: 'module-uuid-1' });

      expect(ModuleRepository.update).toHaveBeenCalledWith('module-uuid-1', {
        repairing: true,
        repairProgress: 0,
      });
      expect(EventLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'module.repair_started' }),
      );
    });

    it('starts repair for warning module', async () => {
      const warningModule = { ...mockModule, status: 'warning' as const };
      const updated = { ...mockCrewMember, assignedModuleId: 'module-uuid-1' };
      vi.mocked(CrewRepository.findById).mockResolvedValue(mockCrewMember);
      vi.mocked(ModuleRepository.findById).mockResolvedValue(warningModule);
      vi.mocked(ModuleRepository.update).mockResolvedValue(warningModule);
      vi.mocked(EventLogRepository.create).mockResolvedValue({} as never);
      vi.mocked(CrewRepository.update).mockResolvedValue(updated);

      await CrewService.updateCrewMember('crew-uuid-1', { assignedModuleId: 'module-uuid-1' });

      expect(ModuleRepository.update).toHaveBeenCalledWith('module-uuid-1', {
        repairing: true,
        repairProgress: 0,
      });
    });

    it('starts repair for offline module', async () => {
      const offlineModule = { ...mockModule, status: 'offline' as const };
      const updated = { ...mockCrewMember, assignedModuleId: 'module-uuid-1' };
      vi.mocked(CrewRepository.findById).mockResolvedValue(mockCrewMember);
      vi.mocked(ModuleRepository.findById).mockResolvedValue(offlineModule);
      vi.mocked(ModuleRepository.update).mockResolvedValue(offlineModule);
      vi.mocked(EventLogRepository.create).mockResolvedValue({} as never);
      vi.mocked(CrewRepository.update).mockResolvedValue(updated);

      await CrewService.updateCrewMember('crew-uuid-1', { assignedModuleId: 'module-uuid-1' });

      expect(ModuleRepository.update).toHaveBeenCalledWith('module-uuid-1', {
        repairing: true,
        repairProgress: 0,
      });
    });

    it('does not start repair when engineer is assigned to a nominal module', async () => {
      const updated = { ...mockCrewMember, assignedModuleId: 'module-uuid-1' };
      vi.mocked(CrewRepository.findById).mockResolvedValue(mockCrewMember);
      vi.mocked(ModuleRepository.findById).mockResolvedValue(mockModule);
      vi.mocked(CrewRepository.update).mockResolvedValue(updated);

      await CrewService.updateCrewMember('crew-uuid-1', { assignedModuleId: 'module-uuid-1' });

      expect(ModuleRepository.update).not.toHaveBeenCalled();
      expect(EventLogRepository.create).not.toHaveBeenCalled();
    });

    it('does not restart repair when module is already repairing', async () => {
      const alreadyRepairing = { ...mockModule, status: 'critical' as const, repairing: true, repairProgress: 42 };
      const updated = { ...mockCrewMember, assignedModuleId: 'module-uuid-1' };
      vi.mocked(CrewRepository.findById).mockResolvedValue(mockCrewMember);
      vi.mocked(ModuleRepository.findById).mockResolvedValue(alreadyRepairing);
      vi.mocked(CrewRepository.update).mockResolvedValue(updated);

      await CrewService.updateCrewMember('crew-uuid-1', { assignedModuleId: 'module-uuid-1' });

      expect(ModuleRepository.update).not.toHaveBeenCalled();
      expect(EventLogRepository.create).not.toHaveBeenCalled();
    });

    it('does not start repair when engineer is injured', async () => {
      const injuredEngineer = { ...mockCrewMember, status: 'injured' as const };
      const criticalModule = { ...mockModule, status: 'critical' as const };
      const updated = { ...injuredEngineer, assignedModuleId: 'module-uuid-1' };
      vi.mocked(CrewRepository.findById).mockResolvedValue(injuredEngineer);
      vi.mocked(ModuleRepository.findById).mockResolvedValue(criticalModule);
      vi.mocked(CrewRepository.update).mockResolvedValue(updated);

      await CrewService.updateCrewMember('crew-uuid-1', { assignedModuleId: 'module-uuid-1' });

      expect(ModuleRepository.update).not.toHaveBeenCalled();
      expect(EventLogRepository.create).not.toHaveBeenCalled();
    });

    it('does not start repair when engineer is resting', async () => {
      const restingEngineer = { ...mockCrewMember, status: 'resting' as const };
      const criticalModule = { ...mockModule, status: 'critical' as const };
      const updated = { ...restingEngineer, assignedModuleId: 'module-uuid-1' };
      vi.mocked(CrewRepository.findById).mockResolvedValue(restingEngineer);
      vi.mocked(ModuleRepository.findById).mockResolvedValue(criticalModule);
      vi.mocked(CrewRepository.update).mockResolvedValue(updated);

      await CrewService.updateCrewMember('crew-uuid-1', { assignedModuleId: 'module-uuid-1' });

      expect(ModuleRepository.update).not.toHaveBeenCalled();
      expect(EventLogRepository.create).not.toHaveBeenCalled();
    });

    it('does not start repair when a non-engineer is assigned to a damaged module', async () => {
      const scientistCrew = { ...mockCrewMember, role: 'scientist' };
      const criticalModule = { ...mockModule, status: 'critical' as const };
      const updated = { ...scientistCrew, assignedModuleId: 'module-uuid-1' };
      vi.mocked(CrewRepository.findById).mockResolvedValue(scientistCrew);
      vi.mocked(ModuleRepository.findById).mockResolvedValue(criticalModule);
      vi.mocked(CrewRepository.update).mockResolvedValue(updated);

      await CrewService.updateCrewMember('crew-uuid-1', { assignedModuleId: 'module-uuid-1' });

      expect(ModuleRepository.update).not.toHaveBeenCalled();
      expect(EventLogRepository.create).not.toHaveBeenCalled();
    });

    it('treats Engineer (capitalized) role the same as engineer', async () => {
      const engineerCapitalized = { ...mockCrewMember, role: 'Engineer' };
      const warningModule = { ...mockModule, status: 'warning' as const };
      const updated = { ...engineerCapitalized, assignedModuleId: 'module-uuid-1' };
      vi.mocked(CrewRepository.findById).mockResolvedValue(engineerCapitalized);
      vi.mocked(ModuleRepository.findById).mockResolvedValue(warningModule);
      vi.mocked(ModuleRepository.update).mockResolvedValue(warningModule);
      vi.mocked(EventLogRepository.create).mockResolvedValue({} as never);
      vi.mocked(CrewRepository.update).mockResolvedValue(updated);

      await CrewService.updateCrewMember('crew-uuid-1', { assignedModuleId: 'module-uuid-1' });

      expect(ModuleRepository.update).toHaveBeenCalledWith('module-uuid-1', {
        repairing: true,
        repairProgress: 0,
      });
    });
  });
});
