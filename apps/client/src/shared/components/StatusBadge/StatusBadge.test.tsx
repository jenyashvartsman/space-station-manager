import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders NOMINAL text for nominal status', () => {
    render(<StatusBadge status="nominal" />);
    expect(screen.getByText('NOMINAL')).toBeTruthy();
  });

  it('renders WARNING text for warning status', () => {
    render(<StatusBadge status="warning" />);
    expect(screen.getByText('WARNING')).toBeTruthy();
  });

  it('renders CRITICAL text for critical status', () => {
    render(<StatusBadge status="critical" />);
    expect(screen.getByText('CRITICAL')).toBeTruthy();
  });

  it('renders OFFLINE text for offline status', () => {
    render(<StatusBadge status="offline" />);
    expect(screen.getByText('OFFLINE')).toBeTruthy();
  });

  it('sets data-status attribute to the status value for nominal', () => {
    const { container } = render(<StatusBadge status="nominal" />);
    expect(container.querySelector('[data-status="nominal"]')).toBeTruthy();
  });

  it('sets data-status attribute to the status value for critical', () => {
    const { container } = render(<StatusBadge status="critical" />);
    expect(container.querySelector('[data-status="critical"]')).toBeTruthy();
  });

  it('sets data-status attribute to the status value for warning', () => {
    const { container } = render(<StatusBadge status="warning" />);
    expect(container.querySelector('[data-status="warning"]')).toBeTruthy();
  });

  it('sets data-status attribute to the status value for offline', () => {
    const { container } = render(<StatusBadge status="offline" />);
    expect(container.querySelector('[data-status="offline"]')).toBeTruthy();
  });
});
