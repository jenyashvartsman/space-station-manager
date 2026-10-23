export type ResourceType = 'oxygen' | 'power' | 'food' | 'fuel' | 'water';

export interface Resource {
  id: string;
  stationId: string;
  type: ResourceType;
  current: number;
  capacity: number;
  consumptionRate: number;
  updatedAt: string;
}
