import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { CrewRoster } from './CrewRoster';
import { useCrewStore } from '../../domains/crew/store/useCrewStore';
import { antdTheme } from '../../shared/theme/antd.theme';
import type { CrewMember } from '../../domains/crew/types/crew.types';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

const mockCrew: CrewMember[] = [
  {
    id: 'c1',
    stationId: 's1',
    name: 'Dr. Elena Vasquez',
    role: 'Scientist',
    status: 'active',
    health: 95,
    assignedModuleId: 'm1',
    assignedModuleName: 'Research Lab',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c2',
    stationId: 's1',
    name: 'Cmdr. James Reeves',
    role: 'Commander',
    status: 'resting',
    health: 80,
    assignedModuleId: null,
    assignedModuleName: null,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c3',
    stationId: 's1',
    name: 'Eng. Priya Nair',
    role: 'Engineer',
    status: 'active',
    health: 70,
    assignedModuleId: 'm2',
    assignedModuleName: 'Engineering Bay',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

function renderRoster() {
  // Seed the Zustand store before render
  useCrewStore.setState({ crew: mockCrew });

  return render(
    <ConfigProvider theme={antdTheme}>
      <CrewRoster />
    </ConfigProvider>,
  );
}

describe('CrewRoster', () => {
  it('renders a card for each crew member', () => {
    renderRoster();
    expect(screen.getByTestId('crew-card-c1')).toBeTruthy();
    expect(screen.getByTestId('crew-card-c2')).toBeTruthy();
    expect(screen.getByTestId('crew-card-c3')).toBeTruthy();
  });

  it('shows crew member names', () => {
    renderRoster();
    expect(screen.getByText('Dr. Elena Vasquez')).toBeTruthy();
    expect(screen.getByText('Cmdr. James Reeves')).toBeTruthy();
  });

  it('renders filter buttons for all status options', () => {
    renderRoster();
    expect(screen.getByTestId('filter-all')).toBeTruthy();
    expect(screen.getByTestId('filter-active')).toBeTruthy();
    expect(screen.getByTestId('filter-resting')).toBeTruthy();
    expect(screen.getByTestId('filter-injured')).toBeTruthy();
    expect(screen.getByTestId('filter-eva')).toBeTruthy();
  });

  it('filters crew by status when a filter button is clicked', () => {
    renderRoster();
    fireEvent.click(screen.getByTestId('filter-resting'));
    expect(screen.queryByTestId('crew-card-c1')).toBeNull();
    expect(screen.queryByTestId('crew-card-c3')).toBeNull();
    expect(screen.getByTestId('crew-card-c2')).toBeTruthy();
  });

  it('shows all crew when "all" filter is selected', () => {
    renderRoster();
    fireEvent.click(screen.getByTestId('filter-active'));
    fireEvent.click(screen.getByTestId('filter-all'));
    expect(screen.getByTestId('crew-card-c1')).toBeTruthy();
    expect(screen.getByTestId('crew-card-c2')).toBeTruthy();
    expect(screen.getByTestId('crew-card-c3')).toBeTruthy();
  });

  it('shows empty message when no crew match the filter', () => {
    renderRoster();
    fireEvent.click(screen.getByTestId('filter-eva'));
    expect(screen.getByText('No crew members match this filter.')).toBeTruthy();
  });

  it('displays the crew count', () => {
    renderRoster();
    expect(screen.getByText('3 crew')).toBeTruthy();
  });
});
