import { stationFetch } from '../../../shared/services/api';
import type { Resource } from '../types/resource.types';

export const resourceService = {
  async getResources(): Promise<Resource[]> {
    const response = await stationFetch<{ data: Resource[] }>('/resources');
    return response.data;
  },
};
