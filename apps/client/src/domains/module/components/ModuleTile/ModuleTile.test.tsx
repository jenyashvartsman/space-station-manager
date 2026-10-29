import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModuleTile } from './ModuleTile';

const mockModule = {
  id: 'm1',
  stationId: 's1',
  type: 'life-support',
  name: 'Life Support Alpha',
  status: 'nominal' as const,
  powerConsumption: 10,
  createdAt: '2026-01-01T00:00:00Z',
  crewCount: 2,
  repairing: false,
  repairProgress: 0,
};

describe('ModuleTile', () => {
  it('renders the module name', () => {
    render(<ModuleTile module={mockModule} />);
    expect(screen.getByText('Life Support Alpha')).toBeTruthy();
  });

  it('renders the status badge', () => {
    render(<ModuleTile module={mockModule} />);
    expect(screen.getByText('NOMINAL')).toBeTruthy();
  });

  it('renders the crew count', () => {
    render(<ModuleTile module={mockModule} />);
    expect(screen.getByText('2 crew')).toBeTruthy();
  });

  it('renders the module type', () => {
    render(<ModuleTile module={mockModule} />);
    expect(screen.getByText('life-support')).toBeTruthy();
  });

  it('renders with critical status badge', () => {
    const criticalModule = { ...mockModule, status: 'critical' as const };
    render(<ModuleTile module={criticalModule} />);
    expect(screen.getByText('CRITICAL')).toBeTruthy();
  });
});
