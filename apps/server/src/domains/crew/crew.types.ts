import type { CrewMember, CrewStatus, ModuleStatus } from '@space-station/db';

export interface AssignedModuleInfo {
  id: string;
  name: string;
  type: string;
  status: ModuleStatus;
}

export interface CrewWithModuleResponse extends CrewMember {
  assignedModule: AssignedModuleInfo | null;
}

export interface UpdateCrewBody {
  status?: CrewStatus;
  health?: number;
  assignedModuleId?: string | null;
}
