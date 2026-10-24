import { useEffect } from 'react';
import { crewService } from '../services/crew.service';
import { useCrewStore } from '../store/useCrewStore';

const POLL_INTERVAL_MS = 5000;

export function useCrewPolling(): void {
  const setCrew = useCrewStore((s) => s.setCrew);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const crew = await crewService.getCrew();
        if (!cancelled) setCrew(crew);
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
  }, [setCrew]);
}
