import { ResourceRepository } from './resource.repository.js';
import type { ResourceResponse } from './resource.types.js';

export const ResourceService = {
  async getAllResources(): Promise<ResourceResponse[]> {
    return ResourceRepository.findAll();
  },
};
