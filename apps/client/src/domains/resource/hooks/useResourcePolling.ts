import { useEffect } from 'react';
import { resourceService } from '../services/resource.service';
import { useResourceStore } from '../store/useResourceStore';

const POLL_INTERVAL_MS = 5000;

export function useResourcePolling(): void {
  const setResources = useResourceStore((s) => s.setResources);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const resources = await resourceService.getResources();
        if (!cancelled) setResources(resources);
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
  }, [setResources]);
}
