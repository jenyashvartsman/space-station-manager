import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { EventLog } from './EventLog';
import { useEventLogStore } from '../../domains/event-log/store/useEventLogStore';
import { antdTheme } from '../../shared/theme/antd.theme';
import type { StationEventEntry } from '../../domains/event-log/types/event-log.types';

vi.mock('../../domains/event-log/hooks/useEventLogPolling', () => ({
  useEventLogPolling: vi.fn(),
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

const MOCK_EVENTS: StationEventEntry[] = [
  {
    id: 'ev1',
    stationId: 's1',
    type: 'alert',
    message: 'Power fluctuation in Power Core',
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
];

function renderPage() {
  return render(
    <ConfigProvider theme={antdTheme}>
      <EventLog />
    </ConfigProvider>,
  );
}

describe('EventLog', () => {
  it('renders the page heading', () => {
    useEventLogStore.setState({ events: [], lastUpdatedAt: null });
    renderPage();
    expect(screen.getByText('STATION EVENT LOG')).toBeTruthy();
  });

  it('renders the EventLogFeed component', () => {
    useEventLogStore.setState({ events: [], lastUpdatedAt: null });
    renderPage();
    expect(screen.getByRole('log', { name: 'Station events' })).toBeTruthy();
  });

  it('renders event entries from the store', () => {
    useEventLogStore.setState({ events: MOCK_EVENTS, lastUpdatedAt: null });
    renderPage();
    expect(screen.getByTestId('event-entry-ev1')).toBeTruthy();
    expect(screen.getByTestId('event-entry-ev2')).toBeTruthy();
  });

  it('shows last updated timestamp when available', () => {
    const now = new Date('2026-10-18T14:32:10.000Z');
    useEventLogStore.setState({ events: [], lastUpdatedAt: now });
    renderPage();
    expect(screen.getByTestId('event-log-updated')).toBeTruthy();
    const text = screen.getByTestId('event-log-updated').textContent ?? '';
    expect(text).toContain('Last updated:');
  });

  it('does not show last updated when lastUpdatedAt is null', () => {
    useEventLogStore.setState({ events: [], lastUpdatedAt: null });
    renderPage();
    expect(screen.queryByTestId('event-log-updated')).toBeNull();
  });

  it('shows empty state when no events in store', () => {
    useEventLogStore.setState({ events: [], lastUpdatedAt: null });
    renderPage();
    expect(screen.getByTestId('events-empty')).toBeTruthy();
  });
});
