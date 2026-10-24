import { stationFetch } from '../../../shared/services/api';
import type { CrewMember } from '../types/crew.types';

export const crewService = {
  async getCrew(): Promise<CrewMember[]> {
    const response = await stationFetch<{ data: CrewMember[] }>('/crew');
    return response.data;
  },

  async updateCrew(
    id: string,
    patch: Partial<Pick<CrewMember, 'status' | 'assignedModuleId'>>,
  ): Promise<CrewMember> {
    const response = await stationFetch<{ data: CrewMember }>(`/crew/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    return response.data;
  },
};
