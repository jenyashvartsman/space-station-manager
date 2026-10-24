import { useRef } from 'react';
import { useResourceTrendChart } from './useResourceTrendChart';
import type { Resource } from '../../types/resource.types';
import type { HistoryPoint } from '../../hooks/useResourceHistory';
import styles from './ResourceTrendChart.module.scss';

interface ResourceTrendChartProps {
  resource: Resource;
  history: HistoryPoint[];
}

export function ResourceTrendChart({ resource, history }: ResourceTrendChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useResourceTrendChart(svgRef, containerRef, resource, history);

  return (
    <div
      ref={containerRef}
      className={styles['resource-trend-chart']}
      data-testid={`resource-trend-chart-${resource.type}`}
      aria-label={`${resource.type} trend chart`}
    >
      <div className={styles['resource-trend-chart__header']}>
        <span className={styles['resource-trend-chart__label']}>
          {resource.type.toUpperCase()}
        </span>
        <span className={styles['resource-trend-chart__reading']}>
          {Math.round(resource.current)} / {resource.capacity}
        </span>
      </div>
      <svg ref={svgRef} className={styles['resource-trend-chart__svg']} />
    </div>
  );
}
