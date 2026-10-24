import { stationFetch } from '../../../shared/services/api';
import type { Module, ModuleDetail, ModuleStatus } from '../types/module.types';

export const moduleService = {
  async getModules(): Promise<Module[]> {
    const response = await stationFetch<{ data: Module[] }>('/modules');
    return response.data;
  },

  async getModule(id: string): Promise<ModuleDetail> {
    const response = await stationFetch<{ data: ModuleDetail }>(`/modules/${id}`);
    return response.data;
  },

  async updateModule(id: string, patch: { status?: ModuleStatus }): Promise<Module> {
    const response = await stationFetch<{ data: Module }>(`/modules/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    return response.data;
  },
};
