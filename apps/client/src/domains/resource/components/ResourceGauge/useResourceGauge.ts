import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GaugeData {
  current: number;
  capacity: number;
}

const SIZE = 120;
const OUTER_RADIUS = 50;
const INNER_RADIUS = 36;
const START_ANGLE = -Math.PI;
const END_ANGLE = Math.PI;

function gaugeColor(fraction: number): string {
  if (fraction > 0.5) return 'var(--color-nominal)';
  if (fraction >= 0.2) return 'var(--color-warning)';
  return 'var(--color-critical)';
}

function makeArcPath(startAngle: number, endAngle: number): string {
  return (
    d3.arc()({
      innerRadius: INNER_RADIUS,
      outerRadius: OUTER_RADIUS,
      startAngle,
      endAngle,
      padAngle: 0,
    }) ?? ''
  );
}

export function useResourceGauge(
  svgRef: React.RefObject<SVGSVGElement>,
  { current, capacity }: GaugeData,
): void {
  const prevEndAngleRef = useRef(START_ANGLE);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const fraction = capacity > 0 ? Math.min(current / capacity, 1) : 0;
    const targetEndAngle = START_ANGLE + fraction * (END_ANGLE - START_ANGLE);
    const color = gaugeColor(fraction);

    const sel = d3.select(svg);
    sel.attr('viewBox', `0 0 ${SIZE} ${SIZE}`);

    let g = sel.select<SVGGElement>('g.gauge-g');
    if (g.empty()) {
      g = sel
        .append('g')
        .attr('class', 'gauge-g')
        .attr('transform', `translate(${SIZE / 2}, ${SIZE / 2})`);
    }

    // Background ring
    let bgPath = g.select<SVGPathElement>('path.gauge-bg');
    if (bgPath.empty()) {
      bgPath = g.append('path').attr('class', 'gauge-bg');
    }
    bgPath
      .attr('d', makeArcPath(START_ANGLE, END_ANGLE))
      .attr('fill', 'var(--color-bg-elevated)');

    // Foreground arc — animated via attrTween
    let fgPath = g.select<SVGPathElement>('path.gauge-fg');
    if (fgPath.empty()) {
      fgPath = g.append('path').attr('class', 'gauge-fg');
    }

    const fromAngle = prevEndAngleRef.current;
    prevEndAngleRef.current = targetEndAngle;

    fgPath.attr('fill', color);
    fgPath
      .transition()
      .duration(400)
      .ease(d3.easeCubicOut)
      .attrTween('d', () => {
        const interp = d3.interpolate(fromAngle, targetEndAngle);
        return (t: number) => makeArcPath(START_ANGLE, interp(t));
      });

    // Center value label
    let valueText = g.select<SVGTextElement>('text.gauge-value');
    if (valueText.empty()) {
      valueText = g
        .append('text')
        .attr('class', 'gauge-value')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle');
    }
    valueText
      .attr('fill', 'var(--color-text-data)')
      .attr('font-family', 'var(--font-data)')
      .attr('font-size', '14')
      .text(Math.round(current).toString());
  }, [svgRef, current, capacity]);
}
