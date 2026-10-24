import { useEffect } from 'react';
import { create } from 'zustand';
import { useResourceStore } from '../store/useResourceStore';

export interface HistoryPoint {
  timestamp: number;
  current: number;
}

export type ResourceHistoryMap = Record<string, HistoryPoint[]>;

interface ResourceHistoryStoreState {
  history: ResourceHistoryMap;
  appendPoints: (updates: Array<{ id: string; current: number }>) => void;
}

const MAX_POINTS = 60;

const useResourceHistoryStore = create<ResourceHistoryStoreState>((set) => ({
  history: {},
  appendPoints: (updates) =>
    set((state) => {
      const now = Date.now();
      const next = { ...state.history };
      for (const { id, current } of updates) {
        const prev = next[id] ?? [];
        const appended = [...prev, { timestamp: now, current }];
        next[id] = appended.length > MAX_POINTS ? appended.slice(-MAX_POINTS) : appended;
      }
      return { history: next };
    }),
}));

export function useResourceHistory(): ResourceHistoryMap {
  const resources = useResourceStore((s) => s.resources);
  const appendPoints = useResourceHistoryStore((s) => s.appendPoints);
  const history = useResourceHistoryStore((s) => s.history);

  useEffect(() => {
    if (resources.length === 0) return;
    appendPoints(resources.map((r) => ({ id: r.id, current: r.current })));
  }, [resources, appendPoints]);

  return history;
}
