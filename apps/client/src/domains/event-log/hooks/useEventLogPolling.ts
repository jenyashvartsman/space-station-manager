import { useEffect } from 'react';
import { eventLogService } from '../services/event-log.service';
import { useEventLogStore } from '../store/useEventLogStore';

const POLL_INTERVAL_MS = 5000;

export function useEventLogPolling(): void {
  const mergeEvents = useEventLogStore((s) => s.mergeEvents);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const events = await eventLogService.getRecentEvents(50);
        if (!cancelled) mergeEvents(events);
      } catch {
        // polling errors are non-fatal
      }
    }

    void poll();
    const interval = setInterval(() => void poll(), POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [mergeEvents]);
}
