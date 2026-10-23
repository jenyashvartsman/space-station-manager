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
}
