import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResourceGauge } from './ResourceGauge';

vi.mock('./useResourceGauge', () => ({
  useResourceGauge: vi.fn(),
}));

const mockResource = {
  id: 'r1',
  stationId: 's1',
  type: 'oxygen' as const,
  current: 75,
  capacity: 100,
  consumptionRate: 1,
  updatedAt: '2026-01-01T00:00:00Z',
};

describe('ResourceGauge', () => {
  it('renders an SVG element', () => {
    render(<ResourceGauge resource={mockResource} />);
    expect(document.querySelector('svg')).toBeTruthy();
  });

  it('renders the resource type label', () => {
    render(<ResourceGauge resource={mockResource} />);
    expect(screen.getByText('OXYGEN')).toBeTruthy();
  });

  it('renders with the correct aria-label', () => {
    render(<ResourceGauge resource={mockResource} />);
    expect(screen.getByLabelText('oxygen gauge')).toBeTruthy();
  });

  it('renders with a data-testid derived from resource type', () => {
    render(<ResourceGauge resource={mockResource} />);
    expect(screen.getByTestId('resource-gauge-oxygen')).toBeTruthy();
  });

  it('accepts current and capacity props without error', () => {
    const lowResource = { ...mockResource, current: 10, capacity: 200 };
    render(<ResourceGauge resource={lowResource} />);
    expect(screen.getByText('OXYGEN')).toBeTruthy();
  });
});
