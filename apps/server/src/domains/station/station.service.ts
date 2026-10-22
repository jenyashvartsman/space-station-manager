import { NotFoundError } from '../../shared/errors.js';
import { StationRepository } from './station.repository.js';
import type { StationResponse, UpdateStationBody } from './station.types.js';

export const StationService = {
  async getStation(): Promise<StationResponse> {
    const station = await StationRepository.findFirst();
    if (!station) {
      throw new NotFoundError('Station not found');
    }
    return station;
  },

  async updateStation(data: UpdateStationBody): Promise<StationResponse> {
    const station = await StationRepository.findFirst();
    if (!station) {
      throw new NotFoundError('Station not found');
    }
    if (data.name === undefined) {
      return station;
    }
    const updated = await StationRepository.update(station.id, {
      name: data.name,
      updatedAt: new Date(),
    });
    if (!updated) {
      throw new NotFoundError('Station not found');
    }
    return updated;
  },
};
