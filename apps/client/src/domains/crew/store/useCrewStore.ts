import { create } from 'zustand';
import type { CrewMember } from '../types/crew.types';

interface CrewState {
  crew: CrewMember[];
  setCrew: (crew: CrewMember[]) => void;
  updateCrewMember: (updated: CrewMember) => void;
}

export const useCrewStore = create<CrewState>((set) => ({
  crew: [],
  setCrew: (crew) => set({ crew }),
  updateCrewMember: (updated) =>
    set((state) => ({
      crew: state.crew.map((c) => (c.id === updated.id ? updated : c)),
    })),
}));
