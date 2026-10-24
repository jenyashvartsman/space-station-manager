export type CrewStatus = 'active' | 'resting' | 'injured' | 'eva';

export type CrewRole =
  | 'Commander'
  | 'Engineer'
  | 'Scientist'
  | 'Medic'
  | 'Pilot'
  | 'Technician';

export interface CrewMember {
  id: string;
  stationId: string;
  name: string;
  role: CrewRole;
  status: CrewStatus;
  health: number;
  assignedModuleId: string | null;
  assignedModuleName: string | null;
  createdAt: string;
}
