import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StationSchematic } from './StationSchematic';

describe('StationSchematic', () => {
  it('renders the svg element', () => {
    render(<StationSchematic />);
    expect(screen.getByTestId('station-schematic')).toBeTruthy();
  });

  it('renders the orbit ring', () => {
    render(<StationSchematic />);
    expect(screen.getByTestId('orbit-ring')).toBeTruthy();
  });

  it('renders the central hub circle', () => {
    render(<StationSchematic />);
    expect(screen.getByTestId('hub-circle')).toBeTruthy();
  });

  it('renders all four satellite nodes', () => {
    render(<StationSchematic />);
    expect(screen.getByTestId('satellite-top')).toBeTruthy();
    expect(screen.getByTestId('satellite-bottom')).toBeTruthy();
    expect(screen.getByTestId('satellite-left')).toBeTruthy();
    expect(screen.getByTestId('satellite-right')).toBeTruthy();
  });

  it('has accessible label', () => {
    render(<StationSchematic />);
    const svg = screen.getByRole('img', { name: 'Space station schematic diagram' });
    expect(svg).toBeTruthy();
  });
});
