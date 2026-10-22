import { NotFoundError } from '../../shared/errors.js';
import { CrewRepository } from '../crew/crew.repository.js';
import { ModuleRepository } from './module.repository.js';
import type { ModuleWithCrewCountResponse, ModuleWithCrewResponse, UpdateModuleBody } from './module.types.js';

export const ModuleService = {
  async getAllModules(): Promise<ModuleWithCrewCountResponse[]> {
    return ModuleRepository.findAll();
  },

  async getModule(id: string): Promise<ModuleWithCrewResponse> {
    const mod = await ModuleRepository.findById(id);
    if (!mod) {
      throw new NotFoundError(`Module ${id} not found`);
    }
    const crew = await ModuleRepository.findCrewByModuleId(id);
    return { ...mod, crew };
  },

  async updateModule(id: string, data: UpdateModuleBody): Promise<ModuleWithCrewResponse> {
    const mod = await ModuleRepository.findById(id);
    if (!mod) {
      throw new NotFoundError(`Module ${id} not found`);
    }

    if (data.status === 'offline' && mod.status !== 'offline') {
      await CrewRepository.setStatusByModuleId(id, 'resting');
    }

    const patch: Partial<Pick<typeof mod, 'status' | 'name'>> = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.name !== undefined) patch.name = data.name;

    const updated = await ModuleRepository.update(id, patch);
    if (!updated) {
      throw new NotFoundError(`Module ${id} not found`);
    }

    const crew = await ModuleRepository.findCrewByModuleId(id);
    return { ...updated, crew };
  },
};
