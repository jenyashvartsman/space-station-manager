import { useRef } from 'react';
import { usePowerConsumptionChart } from './usePowerConsumptionChart';
import type { Module } from '../../types/module.types';
import styles from './PowerConsumptionChart.module.scss';

interface PowerConsumptionChartProps {
  modules: Module[];
}

export function PowerConsumptionChart({ modules }: PowerConsumptionChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  usePowerConsumptionChart(svgRef, containerRef, modules);

  return (
    <div
      ref={containerRef}
      className={styles['power-consumption-chart']}
      data-testid="power-consumption-chart"
      aria-label="Module power consumption chart"
    >
      <svg ref={svgRef} />
    </div>
  );
}
