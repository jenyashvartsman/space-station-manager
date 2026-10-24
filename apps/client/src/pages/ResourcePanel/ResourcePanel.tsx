import { useResourcePolling } from '../../domains/resource/hooks/useResourcePolling';
import { useResourceHistory } from '../../domains/resource/hooks/useResourceHistory';
import { useResourceStore } from '../../domains/resource/store/useResourceStore';
import { ResourceSummaryRow } from '../../domains/resource/components/ResourceSummaryRow/ResourceSummaryRow';
import { ResourceTrendChart } from '../../domains/resource/components/ResourceTrendChart/ResourceTrendChart';
import styles from './ResourcePanel.module.scss';

export function ResourcePanel() {
  const resources = useResourceStore((s) => s.resources);
  const allHistory = useResourceHistory();

  useResourcePolling();

  return (
    <div className={styles['resource-panel']}>
      <header className={styles['resource-panel__header']}>
        <h1 className={styles['resource-panel__title']}>RESOURCES</h1>
      </header>

      <section className={styles['resource-panel__summary']} aria-label="Resource summary">
        {resources.map((resource) => (
          <ResourceSummaryRow key={resource.id} resource={resource} />
        ))}
        {resources.length === 0 && (
          <p className={styles['resource-panel__empty']}>Loading resources…</p>
        )}
      </section>

      <section className={styles['resource-panel__trends']} aria-label="Resource trends">
        <h2 className={styles['resource-panel__trends-title']}>Resource Trends</h2>
        <div className={styles['resource-panel__charts']}>
          {resources.map((resource) => (
            <ResourceTrendChart
              key={resource.id}
              resource={resource}
              history={allHistory[resource.id] ?? []}
            />
          ))}
          {resources.length === 0 && (
            <p className={styles['resource-panel__empty']}>Loading resources…</p>
          )}
        </div>
      </section>
    </div>
  );
}
