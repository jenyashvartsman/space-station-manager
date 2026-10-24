import { create } from 'zustand';
import type { Module } from '../types/module.types';

interface ModuleState {
  modules: Module[];
  setModules: (modules: Module[]) => void;
  updateModule: (updated: Module) => void;
}

export const useModuleStore = create<ModuleState>((set) => ({
  modules: [],
  setModules: (modules) => set({ modules }),
  updateModule: (updated) =>
    set((state) => ({
      modules: state.modules.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)),
    })),
}));
