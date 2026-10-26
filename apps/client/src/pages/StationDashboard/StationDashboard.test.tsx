import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StationDashboard } from './StationDashboard';
import { useStationStore } from '../../domains/station/store/useStationStore';
import { useResourceStore } from '../../domains/resource/store/useResourceStore';
import { useModuleStore } from '../../domains/module/store/useModuleStore';
import type { Station } from '../../domains/station/types/station.types';
import type { Resource } from '../../domains/resource/types/resource.types';
import type { Module } from '../../domains/module/types/module.types';

vi.mock('../../domains/station/hooks/useStationPolling', () => ({
  useStationPolling: vi.fn(),
}));

vi.mock('../../domains/resource/hooks/useResourcePolling', () => ({
  useResourcePolling: vi.fn(),
}));

vi.mock('../../domains/module/hooks/useModulePolling', () => ({
  useModulePolling: vi.fn(),
}));

const MOCK_STATION: Station = {
  id: 's1',
  name: 'ARES-7',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const MOCK_RESOURCES: Resource[] = [
  { id: 'r1', stationId: 's1', type: 'oxygen', current: 850, capacity: 1000, consumptionRate: 2.5, updatedAt: '' },
  { id: 'r2', stationId: 's1', type: 'power', current: 600, capacity: 800, consumptionRate: 1.5, updatedAt: '' },
];

const MOCK_MODULES: Module[] = [
  { id: 'm1', stationId: 's1', type: 'habitat', name: 'Habitat Ring', status: 'nominal', powerConsumption: 10, createdAt: '2026-01-01T00:00:00Z', crewCount: 4 },
  { id: 'm2', stationId: 's1', type: 'power', name: 'Power Core', status: 'warning', powerConsumption: 24, createdAt: '2026-01-01T00:00:00Z', crewCount: 2 },
];

beforeEach(() => {
  useStationStore.setState({ station: MOCK_STATION });
  useResourceStore.setState({ resources: MOCK_RESOURCES });
  useModuleStore.setState({ modules: MOCK_MODULES });
});

afterEach(() => {
  useStationStore.setState({ station: null });
  useResourceStore.setState({ resources: [] });
  useModuleStore.setState({ modules: [] });
});

describe('StationDashboard', () => {
  it('renders column headings: SCHEMATIC, RESOURCE BANKS, MODULE GRID', () => {
    render(<StationDashboard />);
    expect(screen.getByText(/SCHEMATIC/)).toBeTruthy();
    expect(screen.getByText(/RESOURCE BANKS/)).toBeTruthy();
    expect(screen.getByText(/MODULE GRID/)).toBeTruthy();
  });

  it('shows dashboard-skeleton while station is null', () => {
    useStationStore.setState({ station: null });
    render(<StationDashboard />);
    expect(screen.getByTestId('dashboard-skeleton')).toBeTruthy();
  });

  it('renders station name when station data is loaded', () => {
    render(<StationDashboard />);
    expect(screen.getByText('ARES-7')).toBeTruthy();
  });
});
