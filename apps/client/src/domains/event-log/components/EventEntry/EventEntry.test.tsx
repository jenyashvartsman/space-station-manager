import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EventEntry } from './EventEntry';
import type { StationEventEntry } from '../../types/event-log.types';

const BASE_EVENT: StationEventEntry = {
  id: 'ev1',
  stationId: 's1',
  type: 'alert',
  message: 'Power fluctuation in Power Core',
  payload: null,
  createdAt: '2026-10-18T14:32:05.000Z',
};

describe('EventEntry', () => {
  it('renders the event message', () => {
    render(<EventEntry event={BASE_EVENT} />);
    expect(screen.getByTestId('event-message-ev1').textContent).toBe(
      'Power fluctuation in Power Core',
    );
  });

  it('renders the timestamp in HH:MM:SS format', () => {
    render(<EventEntry event={BASE_EVENT} />);
    const ts = screen.getByTestId('event-timestamp-ev1').textContent ?? '';
    expect(ts).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it('renders the type label in uppercase with underscores replaced', () => {
    render(<EventEntry event={BASE_EVENT} />);
    expect(screen.getByTestId('event-type-ev1').textContent).toBe('ALERT');
  });

  it('applies critical color class for alert type', () => {
    render(<EventEntry event={BASE_EVENT} />);
    const label = screen.getByTestId('event-type-ev1');
    expect(label.className).toContain('status--critical');
  });

  it('applies nominal color class for mission_complete type', () => {
    render(
      <EventEntry
        event={{ ...BASE_EVENT, id: 'ev2', type: 'mission_complete' }}
      />,
    );
    expect(screen.getByTestId('event-type-ev2').className).toContain(
      'status--nominal',
    );
  });

  it('applies warning color class for resource_low type', () => {
    render(
      <EventEntry
        event={{ ...BASE_EVENT, id: 'ev3', type: 'resource_low' }}
      />,
    );
    expect(screen.getByTestId('event-type-ev3').className).toContain(
      'status--warning',
    );
  });

  it('applies offline color class for module_offline type', () => {
    render(
      <EventEntry
        event={{ ...BASE_EVENT, id: 'ev4', type: 'module_offline' }}
      />,
    );
    expect(screen.getByTestId('event-type-ev4').className).toContain(
      'status--offline',
    );
  });

  it('renders type label with underscores replaced by spaces', () => {
    render(
      <EventEntry
        event={{ ...BASE_EVENT, id: 'ev5', type: 'resource_depleted' }}
      />,
    );
    expect(screen.getByTestId('event-type-ev5').textContent).toBe(
      'RESOURCE DEPLETED',
    );
  });
});
