import type { CrewMember } from '@space-station/db';

import { NotFoundError, ValidationError } from '../../shared/errors.js';
import { ModuleRepository } from '../module/module.repository.js';
import { CrewRepository } from './crew.repository.js';
import type { CrewWithModuleResponse, UpdateCrewBody } from './crew.types.js';

export const CrewService = {
  async getAllCrew(): Promise<CrewWithModuleResponse[]> {
    return CrewRepository.findAll();
  },

  async getCrewMember(id: string): Promise<CrewMember> {
    const crew = await CrewRepository.findById(id);
    if (!crew) {
      throw new NotFoundError(`Crew member ${id} not found`);
    }
    return crew;
  },

  async updateCrewMember(id: string, data: UpdateCrewBody): Promise<CrewMember> {
    const crew = await CrewRepository.findById(id);
    if (!crew) {
      throw new NotFoundError(`Crew member ${id} not found`);
    }

    if (data.assignedModuleId != null) {
      const mod = await ModuleRepository.findById(data.assignedModuleId);
      if (!mod) {
        throw new NotFoundError(`Module ${data.assignedModuleId} not found`);
      }
      if (mod.stationId !== crew.stationId) {
        throw new ValidationError('Module does not belong to the same station as the crew member');
      }
    }

    const patch: Partial<Pick<CrewMember, 'status' | 'health' | 'assignedModuleId'>> = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.health !== undefined) patch.health = data.health;
    if (data.assignedModuleId !== undefined) patch.assignedModuleId = data.assignedModuleId;

    const updated = await CrewRepository.update(id, patch);
    if (!updated) {
      throw new NotFoundError(`Crew member ${id} not found`);
    }
    return updated;
  },
};
