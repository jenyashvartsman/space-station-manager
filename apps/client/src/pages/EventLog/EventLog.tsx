import { useEventLogPolling } from '../../domains/event-log/hooks/useEventLogPolling';
import { useEventLogStore } from '../../domains/event-log/store/useEventLogStore';
import { EventLogFeed } from '../../domains/event-log/components/EventLogFeed/EventLogFeed';
import styles from './EventLog.module.scss';

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function EventLog() {
  const events = useEventLogStore((s) => s.events);
  const lastUpdatedAt = useEventLogStore((s) => s.lastUpdatedAt);

  useEventLogPolling();

  return (
    <div className={styles['event-log']}>
      <header className={styles['event-log__header']}>
        <h1 className={styles['event-log__title']}>STATION EVENT LOG</h1>
        {lastUpdatedAt && (
          <span
            className={`${styles['event-log__updated']} text--muted`}
            data-testid="event-log-updated"
          >
            Last updated: {formatTime(lastUpdatedAt)}
          </span>
        )}
      </header>

      <div className={styles['event-log__divider']} />

      <EventLogFeed events={events} />
    </div>
  );
}
