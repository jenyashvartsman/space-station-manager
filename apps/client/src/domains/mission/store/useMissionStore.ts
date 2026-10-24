import { create } from 'zustand';
import type { Mission } from '../types/mission.types';

interface MissionState {
  missions: Mission[];
  setMissions: (missions: Mission[]) => void;
  addMission: (mission: Mission) => void;
  updateMission: (updated: Mission) => void;
}

export const useMissionStore = create<MissionState>((set) => ({
  missions: [],
  setMissions: (missions) => set({ missions }),
  addMission: (mission) =>
    set((state) => ({ missions: [...state.missions, mission] })),
  updateMission: (updated) =>
    set((state) => ({
      missions: state.missions.map((m) => (m.id === updated.id ? updated : m)),
    })),
}));
