import type { CrewMember } from '../../crew/types/crew.types';

export type ModuleStatus = 'nominal' | 'warning' | 'critical' | 'offline';

export interface Module {
  id: string;
  stationId: string;
  type: string;
  name: string;
  status: ModuleStatus;
  powerConsumption: number;
  createdAt: string;
  crewCount: number;
  repairing: boolean;
  repairProgress: number;
}

export interface ModuleDetail {
  id: string;
  stationId: string;
  type: string;
  name: string;
  status: ModuleStatus;
  powerConsumption: number;
  createdAt: string;
  crew: CrewMember[];
  repairing: boolean;
  repairProgress: number;
}
