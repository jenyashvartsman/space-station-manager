import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MissionBadge } from './MissionBadge';
import type { MissionStatus } from '../../types/mission.types';

const ALL_STATUSES: MissionStatus[] = ['active', 'queued', 'complete', 'failed'];

describe('MissionBadge', () => {
  it.each(ALL_STATUSES)('renders for status "%s"', (status) => {
    render(<MissionBadge status={status} />);
    expect(screen.getByTestId(`mission-badge-${status}`)).toBeTruthy();
  });

  it('applies nominal color for active status', () => {
    render(<MissionBadge status="active" />);
    const svg = screen.getByTestId('mission-badge-active');
    const circle = svg.querySelector('circle');
    expect(circle?.getAttribute('stroke')).toBe('var(--color-nominal)');
  });

  it('applies warning color for queued status', () => {
    render(<MissionBadge status="queued" />);
    const svg = screen.getByTestId('mission-badge-queued');
    const circle = svg.querySelector('circle');
    expect(circle?.getAttribute('stroke')).toBe('var(--color-warning)');
  });

  it('applies critical color for failed status', () => {
    render(<MissionBadge status="failed" />);
    const svg = screen.getByTestId('mission-badge-failed');
    const circle = svg.querySelector('circle');
    expect(circle?.getAttribute('stroke')).toBe('var(--color-critical)');
  });

  it('applies muted color for complete status', () => {
    render(<MissionBadge status="complete" />);
    const svg = screen.getByTestId('mission-badge-complete');
    const circle = svg.querySelector('circle');
    expect(circle?.getAttribute('stroke')).toBe('var(--color-text-muted)');
  });

  it('renders at the default size of 28', () => {
    render(<MissionBadge status="active" />);
    const svg = screen.getByTestId('mission-badge-active');
    expect(svg.getAttribute('width')).toBe('28');
    expect(svg.getAttribute('height')).toBe('28');
  });

  it('renders at a custom size', () => {
    render(<MissionBadge status="queued" size={20} />);
    const svg = screen.getByTestId('mission-badge-queued');
    expect(svg.getAttribute('width')).toBe('20');
    expect(svg.getAttribute('height')).toBe('20');
  });
});
