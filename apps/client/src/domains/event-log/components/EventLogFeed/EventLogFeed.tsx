import { useState } from 'react';
import { Select } from 'antd';
import { AnimatePresence } from 'framer-motion';
import { EventEntry } from '../EventEntry/EventEntry';
import styles from './EventLogFeed.module.scss';
import type { StationEventEntry } from '../../types/event-log.types';

const EVENT_TYPE_OPTIONS = [
  { label: 'Alert', value: 'alert' },
  { label: 'Mission Complete', value: 'mission_complete' },
  { label: 'Mission Failed', value: 'mission_failed' },
  { label: 'Crew Injured', value: 'crew_injured' },
  { label: 'Resource Depleted', value: 'resource_depleted' },
  { label: 'Resource Low', value: 'resource_low' },
  { label: 'Module Offline', value: 'module_offline' },
];

interface EventLogFeedProps {
  events: StationEventEntry[];
}

export function EventLogFeed({ events }: EventLogFeedProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const filteredEvents =
    selectedTypes.length === 0
      ? events
      : events.filter((e) => selectedTypes.includes(e.type));

  return (
    <div className={styles['event-log-feed']}>
      <div className={styles['event-log-feed__filter']}>
        <Select
          mode="multiple"
          placeholder="All Types"
          options={EVENT_TYPE_OPTIONS}
          value={selectedTypes}
          onChange={setSelectedTypes}
          className={styles['event-log-feed__select']}
          data-testid="event-type-filter"
        />
      </div>

      <div
        className={styles['event-log-feed__list']}
        role="log"
        aria-label="Station events"
      >
        <AnimatePresence initial={false}>
          {filteredEvents.map((event) => (
            <EventEntry key={event.id} event={event} />
          ))}
        </AnimatePresence>
        {filteredEvents.length === 0 && (
          <p
            className={styles['event-log-feed__empty']}
            data-testid="events-empty"
          >
            No events to display.
          </p>
        )}
      </div>
    </div>
  );
}
