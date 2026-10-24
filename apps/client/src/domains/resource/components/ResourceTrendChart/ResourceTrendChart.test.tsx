import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResourceTrendChart } from './ResourceTrendChart';
import type { Resource } from '../../types/resource.types';
import type { HistoryPoint } from '../../hooks/useResourceHistory';

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

const mockResource: Resource = {
  id: 'r1',
  stationId: 's1',
  type: 'oxygen',
  current: 850,
  capacity: 1000,
  consumptionRate: 2.5,
  updatedAt: '2026-01-01T00:00:00Z',
};

const mockHistory: HistoryPoint[] = [
  { timestamp: Date.now() - 10000, current: 870 },
  { timestamp: Date.now() - 5000, current: 860 },
  { timestamp: Date.now(), current: 850 },
];

describe('ResourceTrendChart', () => {
  it('renders the chart container', () => {
    render(<ResourceTrendChart resource={mockResource} history={mockHistory} />);
    expect(screen.getByTestId('resource-trend-chart-oxygen')).toBeTruthy();
  });

  it('renders an SVG element', () => {
    const { container } = render(
      <ResourceTrendChart resource={mockResource} history={mockHistory} />,
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders an area path', () => {
    const { container } = render(
      <ResourceTrendChart resource={mockResource} history={mockHistory} />,
    );
    expect(container.querySelector('[data-testid="trend-area"]')).toBeTruthy();
  });

  it('renders a line path', () => {
    const { container } = render(
      <ResourceTrendChart resource={mockResource} history={mockHistory} />,
    );
    expect(container.querySelector('[data-testid="trend-line"]')).toBeTruthy();
  });

  it('renders with the resource type label', () => {
    render(<ResourceTrendChart resource={mockResource} history={mockHistory} />);
    expect(screen.getByText('OXYGEN')).toBeTruthy();
  });

  it('renders with the correct aria-label', () => {
    render(<ResourceTrendChart resource={mockResource} history={mockHistory} />);
    expect(screen.getByLabelText('oxygen trend chart')).toBeTruthy();
  });

  it('renders warning and critical threshold lines', () => {
    const { container } = render(
      <ResourceTrendChart resource={mockResource} history={mockHistory} />,
    );
    expect(container.querySelector('[data-testid="threshold-warning"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="threshold-critical"]')).toBeTruthy();
  });

  it('renders with empty history without crashing', () => {
    render(<ResourceTrendChart resource={mockResource} history={[]} />);
    expect(screen.getByTestId('resource-trend-chart-oxygen')).toBeTruthy();
  });
});
