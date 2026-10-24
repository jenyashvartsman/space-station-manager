export interface StationEventEntry {
  id: string;
  stationId: string;
  type: string;
  message: string;
  payload: Record<string, unknown> | null;
  createdAt: string;
}
