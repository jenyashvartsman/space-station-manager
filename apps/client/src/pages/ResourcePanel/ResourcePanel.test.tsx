import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResourcePanel } from './ResourcePanel';
import { useResourceStore } from '../../domains/resource/store/useResourceStore';
import type { Resource } from '../../domains/resource/types/resource.types';

vi.mock('../../domains/resource/hooks/useResourcePolling', () => ({
  useResourcePolling: vi.fn(),
}));

vi.mock('../../domains/resource/hooks/useResourceHistory', () => ({
  useResourceHistory: vi.fn(() => ({})),
}));

vi.mock(
  '../../domains/resource/components/ResourceTrendChart/useResourceTrendChart',
  () => ({
    useResourceTrendChart: vi.fn(),
  }),
);

const MOCK_RESOURCES: Resource[] = [
  {
    id: 'r1',
    stationId: 's1',
    type: 'oxygen',
    current: 850,
    capacity: 1000,
    consumptionRate: 2.5,
    updatedAt: '',
  },
  {
    id: 'r2',
    stationId: 's1',
    type: 'power',
    current: 600,
    capacity: 800,
    consumptionRate: 1.5,
    updatedAt: '',
  },
  {
    id: 'r3',
    stationId: 's1',
    type: 'food',
    current: 400,
    capacity: 500,
    consumptionRate: 0.8,
    updatedAt: '',
  },
  {
    id: 'r4',
    stationId: 's1',
    type: 'fuel',
    current: 300,
    capacity: 600,
    consumptionRate: 1.0,
    updatedAt: '',
  },
  {
    id: 'r5',
    stationId: 's1',
    type: 'water',
    current: 700,
    capacity: 900,
    consumptionRate: 1.2,
    updatedAt: '',
  },
];

beforeEach(() => {
  useResourceStore.setState({ resources: MOCK_RESOURCES });
});

afterEach(() => {
  useResourceStore.setState({ resources: [] });
});

describe('ResourcePanel', () => {
  it('renders 5 summary rows', () => {
    render(<ResourcePanel />);
    const summaryRows = screen.getAllByTestId(/^resource-summary-row-/);
    expect(summaryRows.length).toBe(5);
  });

  it('renders 5 trend charts', () => {
    render(<ResourcePanel />);
    const charts = screen.getAllByTestId(/^resource-trend-chart-/);
    expect(charts.length).toBe(5);
  });

  it('renders the RESOURCES heading', () => {
    render(<ResourcePanel />);
    expect(screen.getByText('RESOURCES')).toBeTruthy();
  });

  it('renders the Resource Trends section title', () => {
    render(<ResourcePanel />);
    expect(screen.getByText('Resource Trends')).toBeTruthy();
  });

  it('renders loading state when resources are empty', () => {
    useResourceStore.setState({ resources: [] });
    render(<ResourcePanel />);
    const loadingMessages = screen.getAllByText('Loading resources…');
    expect(loadingMessages.length).toBe(2);
  });
});
