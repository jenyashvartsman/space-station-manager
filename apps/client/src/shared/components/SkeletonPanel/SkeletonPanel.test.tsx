import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkeletonPanel } from './SkeletonPanel';

describe('SkeletonPanel', () => {
  it('renders with default height', () => {
    render(<SkeletonPanel />);
    const el = screen.getByTestId('skeleton-panel');
    expect(el).toBeTruthy();
    expect(el.style.height).toBe('80px');
  });

  it('applies a string height', () => {
    render(<SkeletonPanel height="120px" />);
    const el = screen.getByTestId('skeleton-panel');
    expect(el.style.height).toBe('120px');
  });

  it('converts numeric height to px string', () => {
    render(<SkeletonPanel height={200} />);
    const el = screen.getByTestId('skeleton-panel');
    expect(el.style.height).toBe('200px');
  });

  it('has role status for accessibility', () => {
    render(<SkeletonPanel />);
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('has accessible label', () => {
    render(<SkeletonPanel />);
    expect(screen.getByLabelText('Loading')).toBeTruthy();
  });

  it('appends extra className when provided', () => {
    render(<SkeletonPanel className="extra-class" />);
    const el = screen.getByTestId('skeleton-panel');
    expect(el.className).toContain('extra-class');
  });
});
