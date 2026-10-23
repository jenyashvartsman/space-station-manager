import { useEffect } from 'react';
import { stationService } from '../services/station.service';
import { useStationStore } from '../store/useStationStore';

const POLL_INTERVAL_MS = 5000;

export function useStationPolling(): void {
  const setStation = useStationStore((s) => s.setStation);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const station = await stationService.getStation();
        if (!cancelled) setStation(station);
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
  }, [setStation]);
}
