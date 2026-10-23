import { create } from 'zustand';
import type { Module } from '../types/module.types';

interface ModuleState {
  modules: Module[];
  setModules: (modules: Module[]) => void;
}

export const useModuleStore = create<ModuleState>((set) => ({
  modules: [],
  setModules: (modules) => set({ modules }),
}));
