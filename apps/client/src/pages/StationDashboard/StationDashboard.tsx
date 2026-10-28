import { motion } from 'framer-motion';
import { useStationPolling } from '../../domains/station/hooks/useStationPolling';
import { useResourcePolling } from '../../domains/resource/hooks/useResourcePolling';
import { useModulePolling } from '../../domains/module/hooks/useModulePolling';
import { useStationStore } from '../../domains/station/store/useStationStore';
import { useResourceStore } from '../../domains/resource/store/useResourceStore';
import { useModuleStore } from '../../domains/module/store/useModuleStore';
import { StationResetButton } from '../../domains/station/components/StationResetButton/StationResetButton';
import { StationSchematic } from '../../domains/station/components/StationSchematic/StationSchematic';
import { SkeletonPanel } from '../../shared/components/SkeletonPanel/SkeletonPanel';
import { pageEnter, hudColumnEnter, panelContainer, panelItem } from '../../shared/motion/stationMotion';
import type { ModuleStatus } from '../../domains/module/types/module.types';
import type { Resource } from '../../domains/resource/types/resource.types';
import styles from './StationDashboard.module.scss';

function deriveStationStatus(statuses: ModuleStatus[]): string {
  if (statuses.length === 0) return 'NOMINAL';
  if (statuses.includes('critical')) return 'CRITICAL';
  if (statuses.includes('warning')) return 'WARNING';
  if (statuses.every((s) => s === 'offline')) return 'OFFLINE';
  return 'NOMINAL';
}

function deriveResourceStatus(resource: Resource): 'nominal' | 'warning' | 'critical' {
  const pct = resource.capacity > 0 ? resource.current / resource.capacity : 0;
  if (pct >= 0.75) return 'nominal';
  if (pct >= 0.4) return 'warning';
  return 'critical';
}

const MODULE_STATUS_COLOR: Record<string, string> = {
  nominal: 'var(--color-nominal)',
  warning: 'var(--color-warning)',
  critical: 'var(--color-critical)',
  offline: 'var(--color-offline)',
};

function colEnter(i: number) {
  return {
    initial: hudColumnEnter.initial,
    animate: {
      ...hudColumnEnter.animate,
      transition: { ...hudColumnEnter.animate.transition, delay: i * 0.08 },
    },
  };
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

  if (station === null) {
    return (
      <div className={styles['station-dashboard--loading']} data-testid="dashboard-skeleton">
        <SkeletonPanel height="100%" className={styles['station-dashboard__skeleton-col']} />
        <SkeletonPanel height="100%" className={styles['station-dashboard__skeleton-col']} />
        <SkeletonPanel height="100%" className={styles['station-dashboard__skeleton-col']} />
      </div>
    );
  }

  return (
    <motion.div className={styles['station-dashboard']} {...pageEnter}>
      {/* Left column — Station Schematic */}
      <motion.div className={styles['station-dashboard__col']} data-col="schematic" {...colEnter(0)}>
        <div className={styles['station-dashboard__col-header']}>
          <span className={styles['station-dashboard__col-label']}>◈ SCHEMATIC</span>
        </div>

        <div className={styles['station-dashboard__schematic-wrap']}>
          <StationSchematic className={styles['station-dashboard__schematic']} />
        </div>

        <div className={styles['station-dashboard__station-info']}>
          <span
            className={`${styles['station-dashboard__station-status']} ${styles[`station-dashboard__station-status--${statusClass}`]}`}
            aria-live="polite"
          >
            STATUS: {stationStatus}
          </span>
          <span className={styles['station-dashboard__station-name']}>
            {station.name}
          </span>
        </div>

        <div className={styles['station-dashboard__reset-wrap']}>
          <StationResetButton />
        </div>
      </motion.div>

      {/* Center column — Resource Banks */}
      <motion.div className={styles['station-dashboard__col']} data-col="resources" {...colEnter(1)}>
        <div className={styles['station-dashboard__col-header']}>
          <span className={styles['station-dashboard__col-label']}>◈ RESOURCE BANKS</span>
        </div>

        <motion.div
          className={styles['station-dashboard__resource-list']}
          variants={panelContainer}
          initial="initial"
          animate="animate"
        >
          {resources.map((resource) => {
            const pct = resource.capacity > 0
              ? Math.round((resource.current / resource.capacity) * 100)
              : 0;
            const status = deriveResourceStatus(resource);
            return (
              <motion.div
                key={resource.id}
                className={styles['station-dashboard__resource-row']}
                data-testid={`dashboard-resource-${resource.id}`}
                variants={panelItem}
              >
                <div className={styles['station-dashboard__resource-header']}>
                  <span className={styles['station-dashboard__resource-label']}>
                    {resource.type.toUpperCase()}
                  </span>
                  <span className={`${styles['station-dashboard__resource-value']} ${styles[`station-dashboard__resource-value--${status}`]}`}>
                    {resource.current} / {resource.capacity}
                  </span>
                </div>
                <div className={styles['station-dashboard__resource-track']}>
                  <div
                    className={`${styles['station-dashboard__resource-fill']} ${styles[`station-dashboard__resource-fill--${status}`]}`}
                    style={{ width: `${pct}%` }}
                    aria-label={`${resource.type} ${pct}%`}
                  />
                </div>
              </motion.div>
            );
          })}
          {resources.length === 0 && (
            <p className={styles['station-dashboard__empty']}>Loading resources…</p>
          )}
        </motion.div>
      </motion.div>

      {/* Right column — Module Grid */}
      <motion.div className={styles['station-dashboard__col']} data-col="modules" {...colEnter(2)}>
        <div className={styles['station-dashboard__col-header']}>
          <span className={styles['station-dashboard__col-label']}>◈ MODULE GRID</span>
        </div>

        <motion.div
          className={styles['station-dashboard__module-list']}
          variants={panelContainer}
          initial="initial"
          animate="animate"
        >
          {modules.map((module) => (
            <motion.div
              key={module.id}
              className={styles['station-dashboard__module-row']}
              style={{ borderLeftColor: MODULE_STATUS_COLOR[module.status] ?? MODULE_STATUS_COLOR['offline'] }}
              data-testid={`dashboard-module-${module.id}`}
              variants={panelItem}
            >
              <span className={styles['station-dashboard__module-name']}>{module.name}</span>
              <span
                className={`${styles['station-dashboard__module-status']} ${styles[`station-dashboard__module-status--${module.status}`]}`}
              >
                {module.status.toUpperCase()}
              </span>
            </motion.div>
          ))}
          {modules.length === 0 && (
            <p className={styles['station-dashboard__empty']}>Loading modules…</p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
