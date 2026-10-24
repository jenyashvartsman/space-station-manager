import { useEffect } from 'react';
import { missionService } from '../services/mission.service';
import { useMissionStore } from '../store/useMissionStore';

const POLL_INTERVAL_MS = 5000;

export function useMissionPolling(): void {
  const setMissions = useMissionStore((s) => s.setMissions);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const missions = await missionService.getMissions();
        if (!cancelled) setMissions(missions);
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
  }, [setMissions]);
}
