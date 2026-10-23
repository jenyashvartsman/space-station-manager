import { create } from 'zustand';
import type { Resource } from '../types/resource.types';

interface ResourceState {
  resources: Resource[];
  setResources: (resources: Resource[]) => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
  resources: [],
  setResources: (resources) => set({ resources }),
}));
