import { create } from 'zustand';
import type { Station } from '../types/station.types';

interface StationState {
  station: Station | null;
  setStation: (station: Station) => void;
}

export const useStationStore = create<StationState>((set) => ({
  station: null,
  setStation: (station) => set({ station }),
}));
