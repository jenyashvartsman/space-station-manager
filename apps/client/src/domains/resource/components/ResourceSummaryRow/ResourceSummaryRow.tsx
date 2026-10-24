import type { Resource } from '../../types/resource.types';
import styles from './ResourceSummaryRow.module.scss';

interface ResourceSummaryRowProps {
  resource: Resource;
}

function barColor(fillPercent: number): string {
  if (fillPercent > 50) return 'var(--color-nominal)';
  if (fillPercent >= 20) return 'var(--color-warning)';
  return 'var(--color-critical)';
}

export function ResourceSummaryRow({ resource }: ResourceSummaryRowProps) {
  const fillPercent =
    resource.capacity > 0
      ? Math.min((resource.current / resource.capacity) * 100, 100)
      : 0;

  return (
    <div
      className={styles['resource-summary-row']}
      data-testid={`resource-summary-row-${resource.type}`}
    >
      <span className={styles['resource-summary-row__name']}>
        {resource.type.toUpperCase()}
      </span>

      <div
        className={styles['resource-summary-row__bar-track']}
        aria-label={`${resource.type} fill level`}
      >
        <div
          className={styles['resource-summary-row__bar-fill']}
          style={{ width: `${fillPercent}%`, backgroundColor: barColor(fillPercent) }}
        />
      </div>

      <span className={styles['resource-summary-row__values']}>
        {Math.round(resource.current)} / {resource.capacity}
      </span>

      <span className={styles['resource-summary-row__trend']}>↓ CONSUMING</span>

      <span className={styles['resource-summary-row__rate']}>
        {resource.consumptionRate}/tick
      </span>
    </div>
  );
}
