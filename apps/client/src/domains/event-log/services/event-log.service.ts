import { stationFetch } from '../../../shared/services/api';
import type { StationEventEntry } from '../types/event-log.types';

export const eventLogService = {
  async getRecentEvents(limit = 50): Promise<StationEventEntry[]> {
    const response = await stationFetch<{ data: StationEventEntry[] }>(
      `/events?limit=${limit}`,
    );
    return response.data;
  },
};
