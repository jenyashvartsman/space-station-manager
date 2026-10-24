import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResourceSummaryRow } from './ResourceSummaryRow';
import type { Resource } from '../../types/resource.types';

const mockResource: Resource = {
  id: 'r1',
  stationId: 's1',
  type: 'oxygen',
  current: 850,
  capacity: 1000,
  consumptionRate: 2.5,
  updatedAt: '2026-01-01T00:00:00Z',
};

describe('ResourceSummaryRow', () => {
  it('renders the resource name', () => {
    render(<ResourceSummaryRow resource={mockResource} />);
    expect(screen.getByText('OXYGEN')).toBeTruthy();
  });

  it('renders current and capacity values', () => {
    render(<ResourceSummaryRow resource={mockResource} />);
    expect(screen.getByText('850 / 1000')).toBeTruthy();
  });

  it('renders the consumption rate', () => {
    render(<ResourceSummaryRow resource={mockResource} />);
    expect(screen.getByText('2.5/tick')).toBeTruthy();
  });

  it('renders the fill bar track with aria-label', () => {
    render(<ResourceSummaryRow resource={mockResource} />);
    expect(screen.getByLabelText('oxygen fill level')).toBeTruthy();
  });

  it('renders with data-testid', () => {
    render(<ResourceSummaryRow resource={mockResource} />);
    expect(screen.getByTestId('resource-summary-row-oxygen')).toBeTruthy();
  });

  it('renders trend indicator', () => {
    render(<ResourceSummaryRow resource={mockResource} />);
    expect(screen.getByText('↓ CONSUMING')).toBeTruthy();
  });

  it('renders correctly when current equals capacity', () => {
    const fullResource = { ...mockResource, current: 1000, capacity: 1000 };
    render(<ResourceSummaryRow resource={fullResource} />);
    expect(screen.getByText('1000 / 1000')).toBeTruthy();
  });
});
