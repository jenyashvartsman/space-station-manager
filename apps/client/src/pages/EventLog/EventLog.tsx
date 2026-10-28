import { motion } from 'framer-motion';
import { useEventLogPolling } from '../../domains/event-log/hooks/useEventLogPolling';
import { useEventLogStore } from '../../domains/event-log/store/useEventLogStore';
import { EventLogFeed } from '../../domains/event-log/components/EventLogFeed/EventLogFeed';
import { pageEnter, hudBoot } from '../../shared/motion/stationMotion';
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
    <motion.div className={styles['event-log']} {...pageEnter}>
      <motion.div className={styles['event-log__header']} {...hudBoot}>
        <span className={styles['event-log__title']}>◈ STATION COMMS LOG</span>
        <div className={styles['event-log__live']} data-testid="event-log-live">
          <span className={styles['event-log__live-dot']} aria-hidden="true">●</span>
          <span className={styles['event-log__live-label']}>LIVE</span>
          {lastUpdatedAt && (
            <span
              className={styles['event-log__timestamp']}
              data-testid="event-log-updated"
            >
              {formatTime(lastUpdatedAt)}
            </span>
          )}
        </div>
      </motion.div>

      <motion.div className={styles['event-log__feed']} {...hudBoot}>
        <EventLogFeed events={events} />
      </motion.div>
    </motion.div>
  );
}
