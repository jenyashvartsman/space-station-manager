import styles from './SkeletonPanel.module.scss';

interface SkeletonPanelProps {
  height?: string | number;
  className?: string;
}

export function SkeletonPanel({ height = '80px', className }: SkeletonPanelProps) {
  const style = { height: typeof height === 'number' ? `${height}px` : height };

  return (
    <div
      className={`${styles['skeleton-panel']} ${className ?? ''}`.trim()}
      style={style}
      role="status"
      aria-label="Loading"
      data-testid="skeleton-panel"
    />
  );
}
