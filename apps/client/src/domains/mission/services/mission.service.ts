import { stationFetch } from '../../../shared/services/api';
import type { Mission, CreateMissionBody } from '../types/mission.types';

export const missionService = {
  async getMissions(): Promise<Mission[]> {
    const response = await stationFetch<{ data: Mission[] }>('/missions');
    return response.data;
  },

  async createMission(body: CreateMissionBody): Promise<Mission> {
    const response = await stationFetch<{ data: Mission }>('/missions', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return response.data;
  },

  async updateMissionStatus(
    id: string,
    status: 'active' | 'complete' | 'failed',
  ): Promise<Mission> {
    const response = await stationFetch<{ data: Mission }>(`/missions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.data;
  },
};
