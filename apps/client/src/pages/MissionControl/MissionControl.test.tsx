import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { MissionControl } from './MissionControl';
import { useMissionStore } from '../../domains/mission/store/useMissionStore';
import { antdTheme } from '../../shared/theme/antd.theme';
import type { Mission } from '../../domains/mission/types/mission.types';

vi.mock('../../domains/mission/hooks/useMissionPolling', () => ({
  useMissionPolling: vi.fn(),
}));

vi.mock('../../domains/mission/components/MissionTimer/MissionTimer', () => ({
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

const mockMissions: Mission[] = [
  {
    id: 'm1',
    stationId: 's1',
    title: 'Asteroid Survey',
    description: 'Survey sector 7',
    status: 'active',
    durationSeconds: 300,
    startedAt: new Date(Date.now() - 60000).toISOString(),
    completedAt: null,
    reward: { fuel: 50 },
  },
  {
    id: 'm2',
    stationId: 's1',
    title: 'Hull Inspection',
    description: '',
    status: 'queued',
    durationSeconds: 120,
    startedAt: null,
    completedAt: null,
    reward: null,
  },
  {
    id: 'm3',
    stationId: 's1',
    title: 'Supply Run',
    description: '',
    status: 'complete',
    durationSeconds: 180,
    startedAt: new Date(Date.now() - 600000).toISOString(),
    completedAt: new Date(Date.now() - 420000).toISOString(),
    reward: null,
  },
];

function renderPage(missions: Mission[] = mockMissions) {
  useMissionStore.setState({ missions });
  return render(
    <ConfigProvider theme={antdTheme}>
      <MissionControl />
    </ConfigProvider>,
  );
}

describe('MissionControl', () => {
  it('renders the ACTIVE OPS column heading', () => {
    renderPage();
    expect(screen.getByText('◈ ACTIVE OPS')).toBeTruthy();
  });

  it('renders the QUEUED OPS column heading', () => {
    renderPage();
    expect(screen.getByText('◈ QUEUED OPS')).toBeTruthy();
  });

  it('renders the COMPLETED OPS column heading', () => {
    renderPage();
    expect(screen.getByText('◈ COMPLETED OPS')).toBeTruthy();
  });

  it('renders active missions in the active column', () => {
    renderPage();
    expect(screen.getByTestId('mission-item-m1')).toBeTruthy();
    expect(screen.getByText('ASTEROID SURVEY')).toBeTruthy();
  });

  it('renders queued missions in the queued column', () => {
    renderPage();
    expect(screen.getByTestId('mission-item-m2')).toBeTruthy();
    expect(screen.getByText('HULL INSPECTION')).toBeTruthy();
  });

  it('renders completed missions in the completed column', () => {
    renderPage();
    expect(screen.getByTestId('mission-item-m3')).toBeTruthy();
    expect(screen.getByText('SUPPLY RUN')).toBeTruthy();
  });

  it('renders the new mission button', () => {
    renderPage();
    expect(screen.getByTestId('new-mission-button')).toBeTruthy();
  });

  it('shows skeleton panels while missions are loading (empty array)', () => {
    renderPage([]);
    const skeletons = screen.getAllByTestId('skeleton-panel');
    expect(skeletons.length).toBe(3);
  });

  it('shows failed missions in the completed column', () => {
    const missions: Mission[] = [
      {
        id: 'm4',
        stationId: 's1',
        title: 'Failed Op',
        description: '',
        status: 'failed',
        durationSeconds: 60,
        startedAt: new Date(Date.now() - 120000).toISOString(),
        completedAt: null,
        reward: null,
      },
    ];
    renderPage(missions);
    expect(screen.getByTestId('mission-item-m4')).toBeTruthy();
    expect(screen.queryByTestId('completed-empty')).toBeNull();
  });
});
