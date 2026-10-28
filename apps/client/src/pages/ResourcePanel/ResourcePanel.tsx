import { motion } from 'framer-motion';
import { useResourcePolling } from '../../domains/resource/hooks/useResourcePolling';
import { useResourceHistory } from '../../domains/resource/hooks/useResourceHistory';
import { useResourceStore } from '../../domains/resource/store/useResourceStore';
import { ResourceTrendChart } from '../../domains/resource/components/ResourceTrendChart/ResourceTrendChart';
import { SkeletonPanel } from '../../shared/components/SkeletonPanel/SkeletonPanel';
import { pageEnter, hudColumnEnter, panelContainer, panelItem } from '../../shared/motion/stationMotion';
import styles from './ResourcePanel.module.scss';

function resourceFillPercent(current: number, capacity: number): number {
  return capacity > 0 ? Math.min((current / capacity) * 100, 100) : 0;
}

function resourceStatus(fillPercent: number): 'nominal' | 'warning' | 'critical' {
  if (fillPercent < 20) return 'critical';
  if (fillPercent <= 50) return 'warning';
  return 'nominal';
}

function colEnter(i: number) {
  return {
    initial: hudColumnEnter.initial,
    animate: {
      ...hudColumnEnter.animate,
      transition: { ...hudColumnEnter.animate.transition, delay: i * 0.08 },
    },
  };
}

export function ResourcePanel() {
  const resources = useResourceStore((s) => s.resources);
  const allHistory = useResourceHistory();

  useResourcePolling();

  return (
    <motion.div className={styles['resource-panel']} {...pageEnter}>
      {/* Left panel — Resource Stores */}
      <motion.div className={styles['resource-panel__panel']} data-panel="stores" {...colEnter(0)}>
        <div className={styles['resource-panel__col-header']}>
          <span className={styles['resource-panel__col-label']}>◈ RESOURCE STORES</span>
        </div>

        <motion.div
          className={styles['resource-panel__inventory']}
          variants={panelContainer}
          initial="initial"
          animate="animate"
        >
          {resources.map((resource) => {
            const fillPercent = resourceFillPercent(resource.current, resource.capacity);
            const status = resourceStatus(fillPercent);
            return (
              <motion.div
                key={resource.id}
                className={styles['resource-panel__inventory-row']}
                data-testid={`resource-summary-row-${resource.type}`}
                variants={panelItem}
              >
                <div className={styles['resource-panel__row-header']}>
                  <span className={styles['resource-panel__resource-name']}>
                    {resource.type.toUpperCase()}
                  </span>
                  {status === 'warning' && (
                    <span className={styles['resource-panel__badge--warning']}>⚠ WARNING</span>
                  )}
                  {status === 'critical' && (
                    <span className={styles['resource-panel__badge--critical']}>⚠ CRITICAL</span>
                  )}
                  <span className={styles['resource-panel__resource-values']}>
                    {Math.round(resource.current)} / {resource.capacity}
                  </span>
                </div>
                <div
                  className={styles['resource-panel__bar-track']}
                  aria-label={`${resource.type} fill level`}
                >
                  <div
                    className={`${styles['resource-panel__bar-fill']} ${
                      status === 'critical' ? styles['resource-panel__bar-fill--critical'] : ''
                    }`}
                    style={{
                      width: `${fillPercent}%`,
                      backgroundColor:
                        status === 'critical'
                          ? 'var(--color-critical)'
                          : status === 'warning'
                            ? 'var(--color-warning)'
                            : 'var(--color-nominal)',
                    }}
                  />
                </div>
                <span className={styles['resource-panel__consumption-rate']}>
                  -{resource.consumptionRate} units/s
                </span>
              </motion.div>
            );
          })}
          {resources.length === 0 && (
            <SkeletonPanel height="80px" />
          )}
        </motion.div>
      </motion.div>

      {/* Right panel — Telemetry Trends */}
      <motion.div className={styles['resource-panel__panel']} data-panel="telemetry" {...colEnter(1)}>
        <div className={styles['resource-panel__col-header']}>
          <span className={styles['resource-panel__col-label']}>◈ TELEMETRY TRENDS</span>
        </div>

        <div className={styles['resource-panel__charts']}>
          {resources.map((resource) => (
            <div key={resource.id} className={styles['resource-panel__chart-section']}>
              <ResourceTrendChart
                resource={resource}
                history={allHistory[resource.id] ?? []}
              />
            </div>
          ))}
          {resources.length === 0 && (
            <SkeletonPanel height="80px" />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
