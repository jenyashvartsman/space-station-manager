import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { MissionItem } from './MissionItem';
import { antdTheme } from '../../../../shared/theme/antd.theme';
import type { Mission } from '../../types/mission.types';

vi.mock('../MissionTimer/MissionTimer', () => ({
  MissionTimer: () => <div data-testid="mock-mission-timer" />,
}));

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

const mockActive: Mission = {
  id: 'm1',
  stationId: 's1',
  title: 'Asteroid Survey',
  description: 'Deploy probe to survey sector 7',
  status: 'active',
  durationSeconds: 300,
  startedAt: new Date(Date.now() - 60000).toISOString(),
  completedAt: null,
  reward: { fuel: 50, oxygen: 30 },
};

const mockQueued: Mission = {
  id: 'm2',
  stationId: 's1',
  title: 'Hull Inspection',
  description: 'Check outer hull integrity',
  status: 'queued',
  durationSeconds: 120,
  startedAt: null,
  completedAt: null,
  reward: null,
};

const mockComplete: Mission = {
  id: 'm3',
  stationId: 's1',
  title: 'Supply Run',
  description: '',
  status: 'complete',
  durationSeconds: 180,
  startedAt: new Date(Date.now() - 600000).toISOString(),
  completedAt: new Date(Date.now() - 420000).toISOString(),
  reward: { food: 20, water: 15 },
};

function wrap(ui: React.ReactElement) {
  return render(<ConfigProvider theme={antdTheme}>{ui}</ConfigProvider>);
}

describe('MissionItem', () => {
  it('renders mission title in uppercase', () => {
    wrap(<MissionItem mission={mockActive} />);
    expect(screen.getByText('ASTEROID SURVEY')).toBeTruthy();
  });

  it('renders mission status badge', () => {
    wrap(<MissionItem mission={mockActive} />);
    expect(screen.getByTestId('mission-status-m1')).toBeTruthy();
    expect(screen.getByText('ACTIVE')).toBeTruthy();
  });

  it('shows MissionTimer for active missions', () => {
    wrap(<MissionItem mission={mockActive} />);
    expect(screen.getByTestId('mock-mission-timer')).toBeTruthy();
  });

  it('does not show MissionTimer for queued missions', () => {
    wrap(<MissionItem mission={mockQueued} />);
    expect(screen.queryByTestId('mock-mission-timer')).toBeNull();
  });

  it('does not show MissionTimer for completed missions', () => {
    wrap(<MissionItem mission={mockComplete} />);
    expect(screen.queryByTestId('mock-mission-timer')).toBeNull();
  });

  it('shows START button for queued missions', () => {
    wrap(<MissionItem mission={mockQueued} onStart={vi.fn()} />);
    expect(screen.getByTestId('mission-start-m2')).toBeTruthy();
  });

  it('calls onStart when START is clicked', () => {
    const onStart = vi.fn();
    wrap(<MissionItem mission={mockQueued} onStart={onStart} />);
    fireEvent.click(screen.getByTestId('mission-start-m2'));
    expect(onStart).toHaveBeenCalledWith('m2');
  });

  it('shows ABORT button for active missions', () => {
    wrap(<MissionItem mission={mockActive} onAbort={vi.fn()} />);
    expect(screen.getByTestId('mission-abort-m1')).toBeTruthy();
  });

  it('calls onAbort when ABORT is clicked', () => {
    const onAbort = vi.fn();
    wrap(<MissionItem mission={mockActive} onAbort={onAbort} />);
    fireEvent.click(screen.getByTestId('mission-abort-m1'));
    expect(onAbort).toHaveBeenCalledWith('m1');
  });

  it('shows mission description', () => {
    wrap(<MissionItem mission={mockActive} />);
    expect(screen.getByText('Deploy probe to survey sector 7')).toBeTruthy();
  });

  it('shows reward text for missions with rewards', () => {
    wrap(<MissionItem mission={mockActive} />);
    const rewardEl = screen.getByText(/Reward:/);
    expect(rewardEl).toBeTruthy();
  });

  it('renders completed mission title', () => {
    wrap(<MissionItem mission={mockComplete} />);
    expect(screen.getByText('SUPPLY RUN')).toBeTruthy();
  });

  it('shows QUEUED status badge for queued missions', () => {
    wrap(<MissionItem mission={mockQueued} />);
    expect(screen.getByText('QUEUED')).toBeTruthy();
  });
});
