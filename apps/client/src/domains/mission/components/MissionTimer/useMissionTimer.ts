import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { RefObject } from 'react';

const SIZE = 80;
const OUTER_RADIUS = 36;
const INNER_RADIUS = 26;
const START_ANGLE = -Math.PI;
const FULL_ANGLE = Math.PI;

function timerColor(remainingFraction: number): string {
  if (remainingFraction > 0.3) return 'var(--color-nominal)';
  if (remainingFraction > 0.1) return 'var(--color-warning)';
  return 'var(--color-critical)';
}

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(m).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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

export function useMissionTimer(
  svgRef: RefObject<SVGSVGElement | null>,
  durationSeconds: number,
  elapsedSeconds: number,
): void {
  const prevEndAngleRef = useRef(FULL_ANGLE);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const remaining = Math.max(0, durationSeconds - elapsedSeconds);
    const remainingFraction = durationSeconds > 0 ? remaining / durationSeconds : 0;
    const color = timerColor(remainingFraction);

    // Arc starts at top (-PI) and sweeps clockwise
    // Full arc = all remaining; arc shrinks as time elapses
    const targetEndAngle = START_ANGLE + remainingFraction * 2 * Math.PI;

    const sel = d3.select(svg);
    sel.attr('viewBox', `0 0 ${SIZE} ${SIZE}`);

    let g = sel.select<SVGGElement>('g.timer-g');
    if (g.empty()) {
      g = sel
        .append('g')
        .attr('class', 'timer-g')
        .attr('transform', `translate(${SIZE / 2}, ${SIZE / 2})`);
    }

    // Background ring
    let bgPath = g.select<SVGPathElement>('path.timer-bg');
    if (bgPath.empty()) {
      bgPath = g
        .append('path')
        .attr('class', 'timer-bg')
        .attr('data-testid', 'timer-bg');
    }
    bgPath
      .attr('d', makeArcPath(START_ANGLE, FULL_ANGLE))
      .attr('fill', 'var(--color-bg-elevated)');

    // Foreground arc — animated via attrTween
    let fgPath = g.select<SVGPathElement>('path.timer-fg');
    if (fgPath.empty()) {
      fgPath = g
        .append('path')
        .attr('class', 'timer-fg')
        .attr('data-testid', 'timer-arc');
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

    // Center time label
    let timeText = g.select<SVGTextElement>('text.timer-label');
    if (timeText.empty()) {
      timeText = g
        .append('text')
        .attr('class', 'timer-label')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('data-testid', 'timer-label');
    }
    timeText
      .attr('fill', 'var(--color-text-data)')
      .attr('font-family', 'var(--font-data)')
      .attr('font-size', '10')
      .text(formatTime(remaining));
  }, [svgRef, durationSeconds, elapsedSeconds]);
}
