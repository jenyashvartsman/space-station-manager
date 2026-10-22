export interface CreateMissionBody {
  title: string;
  description?: string;
  durationSeconds: number;
  reward?: Record<string, number>;
}

export interface UpdateMissionBody {
  status: 'active' | 'complete' | 'failed';
}
