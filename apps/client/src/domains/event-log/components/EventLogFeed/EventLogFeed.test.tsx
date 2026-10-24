import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { EventLogFeed } from './EventLogFeed';
import { antdTheme } from '../../../../shared/theme/antd.theme';
import type { StationEventEntry } from '../../types/event-log.types';

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

const MOCK_EVENTS: StationEventEntry[] = [
  {
    id: 'ev1',
    stationId: 's1',
    type: 'alert',
    message: 'Power fluctuation detected',
    payload: null,
    createdAt: '2026-10-18T14:32:05.000Z',
  },
  {
    id: 'ev2',
    stationId: 's1',
    type: 'mission_complete',
    message: 'Asteroid survey complete',
    payload: null,
    createdAt: '2026-10-18T14:30:00.000Z',
  },
  {
    id: 'ev3',
    stationId: 's1',
    type: 'resource_low',
    message: 'Oxygen supply running low',
    payload: null,
    createdAt: '2026-10-18T14:28:00.000Z',
  },
];

function wrap(ui: React.ReactElement) {
  return render(<ConfigProvider theme={antdTheme}>{ui}</ConfigProvider>);
}

describe('EventLogFeed', () => {
  it('renders an entry for each event', () => {
    wrap(<EventLogFeed events={MOCK_EVENTS} />);
    expect(screen.getByTestId('event-entry-ev1')).toBeTruthy();
    expect(screen.getByTestId('event-entry-ev2')).toBeTruthy();
    expect(screen.getByTestId('event-entry-ev3')).toBeTruthy();
  });

  it('renders each event message', () => {
    wrap(<EventLogFeed events={MOCK_EVENTS} />);
    expect(screen.getByText('Power fluctuation detected')).toBeTruthy();
    expect(screen.getByText('Asteroid survey complete')).toBeTruthy();
    expect(screen.getByText('Oxygen supply running low')).toBeTruthy();
  });

  it('shows empty state when events list is empty', () => {
    wrap(<EventLogFeed events={[]} />);
    expect(screen.getByTestId('events-empty')).toBeTruthy();
  });

  it('renders the type filter control', () => {
    wrap(<EventLogFeed events={MOCK_EVENTS} />);
    expect(screen.getByTestId('event-type-filter')).toBeTruthy();
  });

  it('renders the log region with correct aria label', () => {
    wrap(<EventLogFeed events={MOCK_EVENTS} />);
    expect(screen.getByRole('log', { name: 'Station events' })).toBeTruthy();
  });
});
