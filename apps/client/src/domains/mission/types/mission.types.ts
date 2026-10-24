export type MissionStatus = 'queued' | 'active' | 'complete' | 'failed';

export interface MissionReward {
  oxygen?: number;
  power?: number;
  food?: number;
  fuel?: number;
  water?: number;
}

export interface Mission {
  id: string;
  stationId: string;
  title: string;
  description: string;
  status: MissionStatus;
  durationSeconds: number;
  startedAt: string | null;
  completedAt: string | null;
  reward: MissionReward | null;
}

export interface CreateMissionBody {
  title: string;
  description?: string;
  durationSeconds: number;
  reward?: MissionReward;
}
