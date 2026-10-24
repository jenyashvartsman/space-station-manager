import { useStationPolling } from '../../domains/station/hooks/useStationPolling';
import { useResourcePolling } from '../../domains/resource/hooks/useResourcePolling';
import { useModulePolling } from '../../domains/module/hooks/useModulePolling';
import { useStationStore } from '../../domains/station/store/useStationStore';
import { useResourceStore } from '../../domains/resource/store/useResourceStore';
import { useModuleStore } from '../../domains/module/store/useModuleStore';
import { ResourceGauge } from '../../domains/resource/components/ResourceGauge/ResourceGauge';
import { ModuleTile } from '../../domains/module/components/ModuleTile/ModuleTile';
import { StationResetButton } from '../../domains/station/components/StationResetButton/StationResetButton';
import type { ModuleStatus } from '../../domains/module/types/module.types';
import styles from './StationDashboard.module.scss';

function deriveStationStatus(statuses: ModuleStatus[]): string {
  if (statuses.length === 0) return 'NOMINAL';
  if (statuses.includes('critical')) return 'CRITICAL';
  if (statuses.includes('warning')) return 'WARNING';
  if (statuses.every((s) => s === 'offline')) return 'OFFLINE';
  return 'NOMINAL';
}

export function StationDashboard() {
  const station = useStationStore((s) => s.station);
  const resources = useResourceStore((s) => s.resources);
  const modules = useModuleStore((s) => s.modules);

  useStationPolling();
  useResourcePolling();
  useModulePolling();

  const stationStatus = deriveStationStatus(modules.map((m) => m.status));
  const statusClass = stationStatus.toLowerCase();

  return (
    <div className={styles['station-dashboard']}>
      <header className={styles['station-dashboard__header']}>
        <span
          className={`${styles['station-dashboard__status']} ${styles[`station-dashboard__status--${statusClass}`]}`}
          aria-live="polite"
        >
          STATION STATUS: {stationStatus}
        </span>
        <span className={styles['station-dashboard__name']}>
          {station?.name ?? 'KEPLER STATION ALPHA'}
        </span>
      </header>

      <section className={styles['station-dashboard__section']} aria-label="Resources">
        <h2 className={styles['station-dashboard__section-title']}>Resources</h2>
        <div className={styles['station-dashboard__gauges']}>
          {resources.map((resource) => (
            <ResourceGauge key={resource.id} resource={resource} />
          ))}
          {resources.length === 0 && (
            <p className={styles['station-dashboard__empty']}>Loading resources…</p>
          )}
        </div>
      </section>

      <section className={styles['station-dashboard__section']} aria-label="Modules">
        <h2 className={styles['station-dashboard__section-title']}>Modules</h2>
        <div className={styles['station-dashboard__module-grid']}>
          {modules.map((module) => (
            <ModuleTile key={module.id} module={module} />
          ))}
          {modules.length === 0 && (
            <p className={styles['station-dashboard__empty']}>Loading modules…</p>
          )}
        </div>
      </section>

      <StationResetButton />
    </div>
  );
}
