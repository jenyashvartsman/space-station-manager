import styles from './StatusBadge.module.scss';

export type StatusLevel = 'nominal' | 'warning' | 'critical' | 'offline';

interface StatusBadgeProps {
  status: StatusLevel;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`${styles['status-badge']} ${styles[`status-badge--${status}`]}`}
      data-status={status}
      aria-label={`Status: ${status}`}
    >
      {status.toUpperCase()}
    </span>
  );
}
