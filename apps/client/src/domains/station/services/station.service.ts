import { stationFetch } from '../../../shared/services/api';
import type { Station } from '../types/station.types';

export const stationService = {
  async getStation(): Promise<Station> {
    const response = await stationFetch<{ data: Station }>('/station');
    return response.data;
  },

  async resetStation(): Promise<void> {
    await stationFetch<{ message: string }>('/station/reset', { method: 'POST' });
  },
};
