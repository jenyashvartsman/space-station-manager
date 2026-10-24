import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MissionTimer } from './MissionTimer';

vi.mock('./useMissionTimer', () => ({
  useMissionTimer: vi.fn(),
}));

describe('MissionTimer', () => {
  it('renders an SVG element', () => {
    render(<MissionTimer durationSeconds={120} elapsedSeconds={30} />);
    expect(screen.getByTestId('mission-timer-svg')).toBeTruthy();
  });

  it('renders with aria-label for accessibility', () => {
    render(<MissionTimer durationSeconds={120} elapsedSeconds={30} />);
    expect(screen.getByLabelText('mission countdown timer')).toBeTruthy();
  });

  it('accepts durationSeconds and elapsedSeconds props without error', () => {
    render(<MissionTimer durationSeconds={300} elapsedSeconds={150} />);
    expect(screen.getByTestId('mission-timer-svg')).toBeTruthy();
  });

  it('renders with zero elapsed seconds', () => {
    render(<MissionTimer durationSeconds={60} elapsedSeconds={0} />);
    expect(screen.getByTestId('mission-timer-svg')).toBeTruthy();
  });

  it('renders when fully elapsed', () => {
    render(<MissionTimer durationSeconds={60} elapsedSeconds={60} />);
    expect(screen.getByTestId('mission-timer-svg')).toBeTruthy();
  });
});
