import { useRef } from 'react';
import { useResourceGauge } from './useResourceGauge';
import type { Resource } from '../../types/resource.types';
import styles from './ResourceGauge.module.scss';

interface ResourceGaugeProps {
  resource: Resource;
}

export function ResourceGauge({ resource }: ResourceGaugeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useResourceGauge(svgRef, { current: resource.current, capacity: resource.capacity });

  return (
    <div className={styles['resource-gauge']}>
      <svg
        ref={svgRef}
        className={styles['resource-gauge__svg']}
        aria-label={`${resource.type} gauge`}
        data-testid={`resource-gauge-${resource.type}`}
      />
      <span className={styles['resource-gauge__label']}>{resource.type.toUpperCase()}</span>
    </div>
  );
}
