import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HudUptime } from './HudUptime';

describe('HudUptime', () => {
  it('renders T+00:00:00 on mount', () => {
    render(<HudUptime />);
    expect(screen.getByTestId('hud-uptime').textContent).toBe('T+00:00:00');
  });
});
