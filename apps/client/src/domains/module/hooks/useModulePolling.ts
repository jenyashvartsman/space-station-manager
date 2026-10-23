import { useEffect } from 'react';
import { moduleService } from '../services/module.service';
import { useModuleStore } from '../store/useModuleStore';

const POLL_INTERVAL_MS = 5000;

export function useModulePolling(): void {
  const setModules = useModuleStore((s) => s.setModules);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const modules = await moduleService.getModules();
        if (!cancelled) setModules(modules);
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
  }, [setModules]);
}
