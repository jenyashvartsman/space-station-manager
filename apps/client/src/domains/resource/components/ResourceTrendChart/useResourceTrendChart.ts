import { useEffect } from 'react';
import * as d3 from 'd3';
import type { RefObject } from 'react';
import type { Resource } from '../../types/resource.types';
import type { HistoryPoint } from '../../hooks/useResourceHistory';

const MARGIN = { top: 12, right: 16, bottom: 28, left: 44 };
const CHART_HEIGHT = 120;

function trendColor(resource: Resource): string {
  const fraction = resource.capacity > 0 ? resource.current / resource.capacity : 0;
  if (fraction > 0.5) return 'var(--color-nominal)';
  if (fraction >= 0.2) return 'var(--color-warning)';
  return 'var(--color-critical)';
}

export function useResourceTrendChart(
  svgRef: RefObject<SVGSVGElement | null>,
  containerRef: RefObject<HTMLDivElement | null>,
  resource: Resource,
  history: HistoryPoint[],
): void {
  useEffect(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;

    const totalWidth = container.getBoundingClientRect().width || 500;
    const innerWidth = totalWidth - MARGIN.left - MARGIN.right;
    const innerHeight = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;

    const color = trendColor(resource);
    const gradientId = `trend-gradient-${resource.id}`;

    const now = Date.now();
    const xDomain: [number, number] =
      history.length >= 2
        ? [history[0].timestamp, history[history.length - 1].timestamp]
        : [now - 300_000, now];

    const xScale = d3.scaleTime().domain(xDomain).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([0, resource.capacity]).range([innerHeight, 0]);

    const svgSel = d3.select(svg).attr('width', totalWidth).attr('height', CHART_HEIGHT);

    // Defs + gradient
    let defs = svgSel.select<SVGDefsElement>('defs');
    if (defs.empty()) defs = svgSel.append('defs');

    let gradient = defs.select<SVGLinearGradientElement>(`#${gradientId}`);
    if (gradient.empty()) {
      gradient = defs
        .append('linearGradient')
        .attr('id', gradientId)
        .attr('x1', '0')
        .attr('x2', '0')
        .attr('y1', '0')
        .attr('y2', '1');
      gradient.append('stop').attr('class', 'grad-top').attr('offset', '0%');
      gradient.append('stop').attr('class', 'grad-bottom').attr('offset', '100%');
    }
    gradient
      .select<SVGStopElement>('.grad-top')
      .attr('stop-color', color)
      .attr('stop-opacity', '0.35');
    gradient
      .select<SVGStopElement>('.grad-bottom')
      .attr('stop-color', color)
      .attr('stop-opacity', '0');

    // Root group
    let root = svgSel.select<SVGGElement>('g.trend-root');
    if (root.empty()) root = svgSel.append('g').attr('class', 'trend-root');
    root.attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    // Generators — CatmullRom for smooth curves
    const areaGen = d3
      .area<HistoryPoint>()
      .x((d) => xScale(d.timestamp))
      .y0(innerHeight)
      .y1((d) => yScale(d.current))
      .curve(d3.curveCatmullRom);

    const lineGen = d3
      .line<HistoryPoint>()
      .x((d) => xScale(d.timestamp))
      .y((d) => yScale(d.current))
      .curve(d3.curveCatmullRom);

    const t = d3.transition().duration(400).ease(d3.easeCubicOut);

    // Area path
    let areaPath = root.select<SVGPathElement>('path.trend-area');
    if (areaPath.empty()) {
      areaPath = root
        .append('path')
        .attr('class', 'trend-area')
        .attr('data-testid', 'trend-area');
    }
    areaPath
      .attr('fill', `url(#${gradientId})`)
      .datum(history)
      .transition(t)
      .attr('d', areaGen);

    // Line path
    let linePath = root.select<SVGPathElement>('path.trend-line');
    if (linePath.empty()) {
      linePath = root
        .append('path')
        .attr('class', 'trend-line')
        .attr('fill', 'none')
        .attr('stroke-width', '1.5')
        .attr('data-testid', 'trend-line');
    }
    linePath.attr('stroke', color).datum(history).transition(t).attr('d', lineGen);

    // Warning threshold line at 20% capacity
    const warningY = yScale(resource.capacity * 0.2);
    let warnLine = root.select<SVGLineElement>('line.trend-threshold--warning');
    if (warnLine.empty()) {
      warnLine = root
        .append('line')
        .attr('class', 'trend-threshold--warning')
        .attr('data-testid', 'threshold-warning');
    }
    warnLine
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', warningY)
      .attr('y2', warningY)
      .attr('stroke', 'var(--color-warning)')
      .attr('stroke-width', '1')
      .attr('stroke-dasharray', '4,4');

    // Critical threshold line at 10% capacity
    const criticalY = yScale(resource.capacity * 0.1);
    let critLine = root.select<SVGLineElement>('line.trend-threshold--critical');
    if (critLine.empty()) {
      critLine = root
        .append('line')
        .attr('class', 'trend-threshold--critical')
        .attr('data-testid', 'threshold-critical');
    }
    critLine
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', criticalY)
      .attr('y2', criticalY)
      .attr('stroke', 'var(--color-critical)')
      .attr('stroke-width', '1')
      .attr('stroke-dasharray', '4,4');

    // Y axis
    let yAxisG = root.select<SVGGElement>('g.trend-y-axis');
    if (yAxisG.empty()) yAxisG = root.append('g').attr('class', 'trend-y-axis');
    yAxisG
      .call(d3.axisLeft(yScale).ticks(4))
      .call((g) => g.select('.domain').attr('stroke', 'var(--color-border)'))
      .call((g) => g.selectAll('.tick line').attr('stroke', 'var(--color-border)'))
      .selectAll('text')
      .style('fill', 'var(--color-text-muted)')
      .style('font-family', 'var(--font-data)')
      .style('font-size', '11px');

    // X axis
    let xAxisG = root.select<SVGGElement>('g.trend-x-axis');
    if (xAxisG.empty()) xAxisG = root.append('g').attr('class', 'trend-x-axis');
    xAxisG
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3.axisBottom(xScale).ticks(4).tickFormat((d) => {
          const date = d instanceof Date ? d : new Date(d as number);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }),
      )
      .call((g) => g.select('.domain').attr('stroke', 'var(--color-border)'))
      .call((g) => g.selectAll('.tick line').attr('stroke', 'var(--color-border)'))
      .selectAll('text')
      .style('fill', 'var(--color-text-muted)')
      .style('font-family', 'var(--font-data)')
      .style('font-size', '11px');
  }, [svgRef, containerRef, resource, history]);
}
