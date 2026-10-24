import { motion } from 'framer-motion';
import styles from './EventEntry.module.scss';
import type { StationEventEntry } from '../../types/event-log.types';

interface EventEntryProps {
  event: StationEventEntry;
}

function getTypeColorClass(type: string): string {
  switch (type) {
    case 'alert':
    case 'mission_failed':
    case 'resource_depleted':
      return 'status--critical';
    case 'crew_injured':
    case 'resource_low':
      return 'status--warning';
    case 'mission_complete':
      return 'status--nominal';
    case 'module_offline':
      return 'status--offline';
    default:
      return '';
  }
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function formatTypeLabel(type: string): string {
  return type.replace(/_/g, ' ').toUpperCase();
}

export function EventEntry({ event }: EventEntryProps) {
  const colorClass = getTypeColorClass(event.type);

  return (
    <motion.div
      className={styles['event-entry']}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      data-testid={`event-entry-${event.id}`}
    >
      <div className={styles['event-entry__type']}>
        <span
          className={`${styles['event-entry__dot']} ${colorClass}`}
          aria-hidden="true"
        />
        <span
          className={`${styles['event-entry__label']} text--label ${colorClass}`}
          data-testid={`event-type-${event.id}`}
        >
          {formatTypeLabel(event.type)}
        </span>
      </div>
      <div className={styles['event-entry__body']}>
        <span
          className={styles['event-entry__message']}
          data-testid={`event-message-${event.id}`}
        >
          {event.message}
        </span>
        <span
          className={`${styles['event-entry__timestamp']} text--data`}
          data-testid={`event-timestamp-${event.id}`}
        >
          {formatTimestamp(event.createdAt)}
        </span>
      </div>
    </motion.div>
  );
}
