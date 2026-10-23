import { stationFetch } from '../../../shared/services/api';
import type { Module } from '../types/module.types';

export const moduleService = {
  async getModules(): Promise<Module[]> {
    const response = await stationFetch<{ data: Module[] }>('/modules');
    return response.data;
  },
};
