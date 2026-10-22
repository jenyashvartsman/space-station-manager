import { Station } from '@space-station/db';

export type StationResponse = Station;

export interface UpdateStationBody {
  name?: string;
}
