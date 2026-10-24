import { create } from 'zustand';
import type { StationEventEntry } from '../types/event-log.types';

const MAX_EVENTS = 50;

interface EventLogState {
  events: StationEventEntry[];
  lastUpdatedAt: Date | null;
  mergeEvents: (incoming: StationEventEntry[]) => void;
}

export const useEventLogStore = create<EventLogState>((set) => ({
  events: [],
  lastUpdatedAt: null,
  mergeEvents: (incoming) =>
    set((state) => {
      const existingIds = new Set(state.events.map((e) => e.id));
      const newEntries = incoming.filter((e) => !existingIds.has(e.id));
      const events =
        newEntries.length > 0
          ? [...newEntries, ...state.events].slice(0, MAX_EVENTS)
          : state.events;
      return { events, lastUpdatedAt: new Date() };
    }),
}));
