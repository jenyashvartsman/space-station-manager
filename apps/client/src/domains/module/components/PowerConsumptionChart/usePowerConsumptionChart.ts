import { useEffect } from 'react';
import * as d3 from 'd3';
import type { RefObject } from 'react';
import type { Module } from '../../types/module.types';

const MARGIN = { top: 10, right: 24, bottom: 32, left: 140 };
const BAR_HEIGHT = 28;
const BAR_GAP = 10;

const STATUS_COLOR: Record<string, string> = {
  nominal: 'var(--color-nominal)',
  warning: 'var(--color-warning)',
  critical: 'var(--color-critical)',
  offline: 'var(--color-offline)',
};

export function usePowerConsumptionChart(
  svgRef: RefObject<SVGSVGElement | null>,
  containerRef: RefObject<HTMLDivElement | null>,
  modules: Module[],
): void {
  useEffect(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container || modules.length === 0) return;

    const totalWidth = container.getBoundingClientRect().width || 400;
    const innerWidth = totalWidth - MARGIN.left - MARGIN.right;
    const innerHeight = modules.length * (BAR_HEIGHT + BAR_GAP);
    const totalHeight = innerHeight + MARGIN.top + MARGIN.bottom;

    const maxPower = d3.max(modules, (d) => d.powerConsumption) ?? 1;

    const xScale = d3
      .scaleLinear()
      .domain([0, maxPower * 1.1])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleBand()
      .domain(modules.map((m) => m.name))
      .range([0, innerHeight])
      .padding(0.15);

    const svgSel = d3
      .select(svg)
      .attr('width', totalWidth)
      .attr('height', totalHeight);

    let root = svgSel.select<SVGGElement>('g.pchart-root');
    if (root.empty()) {
      root = svgSel.append('g').attr('class', 'pchart-root');
    }
    root.attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    // Y-axis
    let yAxisGroup = root.select<SVGGElement>('g.pchart-y-axis');
    if (yAxisGroup.empty()) {
      yAxisGroup = root.append('g').attr('class', 'pchart-y-axis');
    }
    yAxisGroup
      .call(d3.axisLeft(yScale).tickSize(0).tickPadding(8))
      .call((g) => g.select('.domain').remove())
      .selectAll('text')
      .style('fill', 'var(--color-text-muted)')
      .style('font-family', 'var(--font-data)')
      .style('font-size', '11px');

    // X-axis
    let xAxisGroup = root.select<SVGGElement>('g.pchart-x-axis');
    if (xAxisGroup.empty()) {
      xAxisGroup = root.append('g').attr('class', 'pchart-x-axis');
    }
    xAxisGroup
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(5)
          .tickFormat((d) => `${d}kW`),
      )
      .call((g) => g.select('.domain').attr('stroke', 'var(--color-border)'))
      .call((g) => g.selectAll('.tick line').attr('stroke', 'var(--color-border)'))
      .selectAll('text')
      .style('fill', 'var(--color-text-muted)')
      .style('font-family', 'var(--font-data)')
      .style('font-size', '11px');

    const t = d3.transition().duration(400).ease(d3.easeCubicOut);

    // Bars — keyed by module id
    const bars = root
      .selectAll<SVGRectElement, Module>('rect.pchart-bar')
      .data(modules, (d) => d.id);

    // Enter
    bars
      .enter()
      .append('rect')
      .attr('class', 'pchart-bar')
      .attr('data-testid', 'power-bar')
      .attr('y', (d) => yScale(d.name) ?? 0)
      .attr('height', yScale.bandwidth())
      .attr('x', 0)
      .attr('rx', 2)
      .attr('width', 0)
      .attr('fill', (d) => STATUS_COLOR[d.status] ?? STATUS_COLOR['nominal'])
      .transition(t)
      .attr('width', (d) => xScale(d.powerConsumption));

    // Update
    bars
      .transition(t)
      .attr('y', (d) => yScale(d.name) ?? 0)
      .attr('height', yScale.bandwidth())
      .attr('width', (d) => xScale(d.powerConsumption))
      .attr('fill', (d) => STATUS_COLOR[d.status] ?? STATUS_COLOR['nominal']);

    // Exit
    bars.exit().transition(t).attr('width', 0).remove();
  }, [svgRef, containerRef, modules]);
}
