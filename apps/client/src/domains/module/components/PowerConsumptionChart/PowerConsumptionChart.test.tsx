import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PowerConsumptionChart } from './PowerConsumptionChart';
import type { Module } from '../../types/module.types';

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

const mockModules: Module[] = [
  {
    id: 'm1',
    stationId: 's1',
    type: 'life-support',
    name: 'Life Support Alpha',
    status: 'nominal',
    powerConsumption: 12,
    createdAt: '2026-01-01T00:00:00Z',
    crewCount: 2,
    repairing: false,
    repairProgress: 0,
  },
  {
    id: 'm2',
    stationId: 's1',
    type: 'engineering',
    name: 'Engineering Bay',
    status: 'warning',
    powerConsumption: 24,
    createdAt: '2026-01-01T00:00:00Z',
    crewCount: 3,
    repairing: false,
    repairProgress: 0,
  },
  {
    id: 'm3',
    stationId: 's1',
    type: 'research',
    name: 'Research Lab',
    status: 'critical',
    powerConsumption: 18,
    createdAt: '2026-01-01T00:00:00Z',
    crewCount: 1,
    repairing: false,
    repairProgress: 0,
  },
];

describe('PowerConsumptionChart', () => {
  it('renders the chart container', () => {
    render(<PowerConsumptionChart modules={mockModules} />);
    expect(screen.getByTestId('power-consumption-chart')).toBeTruthy();
  });

  it('renders an SVG element', () => {
    const { container } = render(<PowerConsumptionChart modules={mockModules} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders one bar per module', () => {
    const { container } = render(<PowerConsumptionChart modules={mockModules} />);
    const bars = container.querySelectorAll('[data-testid="power-bar"]');
    expect(bars.length).toBe(mockModules.length);
  });

  it('renders no bars when modules list is empty', () => {
    const { container } = render(<PowerConsumptionChart modules={[]} />);
    const bars = container.querySelectorAll('[data-testid="power-bar"]');
    expect(bars.length).toBe(0);
  });
});
