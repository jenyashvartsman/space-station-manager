import type { CrewMember, Module, ModuleStatus } from '@space-station/db';

export interface ModuleWithCrewCountResponse extends Module {
  crewCount: number;
}

export interface ModuleWithCrewResponse extends Module {
  crew: CrewMember[];
}

export interface UpdateModuleBody {
  status?: ModuleStatus;
  name?: string;
}
