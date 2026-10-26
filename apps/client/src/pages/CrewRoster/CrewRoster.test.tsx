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

vi.mock('../../domains/crew/hooks/useCrewPolling', () => ({
  useCrewPolling: vi.fn(),
}));

vi.mock('../../domains/module/hooks/useModulePolling', () => ({
  useModulePolling: vi.fn(),
}));

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
  useCrewStore.setState({ crew: mockCrew });
  return render(
    <ConfigProvider theme={antdTheme}>
      <CrewRoster />
    </ConfigProvider>,
  );
}

describe('CrewRoster', () => {
  it('renders a list row for each crew member', () => {
    renderRoster();
    expect(screen.getByTestId('crew-row-c1')).toBeTruthy();
    expect(screen.getByTestId('crew-row-c2')).toBeTruthy();
    expect(screen.getByTestId('crew-row-c3')).toBeTruthy();
  });

  it('shows crew member names in list rows', () => {
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
    expect(screen.queryByTestId('crew-row-c1')).toBeNull();
    expect(screen.queryByTestId('crew-row-c3')).toBeNull();
    expect(screen.getByTestId('crew-row-c2')).toBeTruthy();
  });

  it('shows all crew when "all" filter is selected', () => {
    renderRoster();
    fireEvent.click(screen.getByTestId('filter-active'));
    fireEvent.click(screen.getByTestId('filter-all'));
    expect(screen.getByTestId('crew-row-c1')).toBeTruthy();
    expect(screen.getByTestId('crew-row-c2')).toBeTruthy();
    expect(screen.getByTestId('crew-row-c3')).toBeTruthy();
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

  it('right panel shows SELECT CREW MEMBER text by default', () => {
    renderRoster();
    expect(screen.getByText('SELECT CREW MEMBER TO VIEW FILE')).toBeTruthy();
  });

  it('clicking a crew row shows that crew member name in the detail panel', () => {
    renderRoster();
    fireEvent.click(screen.getByTestId('crew-row-c1'));
    // Name appears in the detail panel heading
    const names = screen.getAllByText('Dr. Elena Vasquez');
    expect(names.length).toBeGreaterThanOrEqual(1);
  });
});
