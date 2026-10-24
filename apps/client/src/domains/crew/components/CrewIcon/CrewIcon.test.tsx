import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CrewIcon } from './CrewIcon';

describe('CrewIcon', () => {
  it('renders the svg element', () => {
    render(<CrewIcon />);
    expect(screen.getByTestId('crew-icon')).toBeTruthy();
  });

  it('renders at the default size of 32', () => {
    render(<CrewIcon />);
    const svg = screen.getByTestId('crew-icon');
    expect(svg.getAttribute('width')).toBe('32');
    expect(svg.getAttribute('height')).toBe('32');
  });

  it('renders at a custom size', () => {
    render(<CrewIcon size={24} />);
    const svg = screen.getByTestId('crew-icon');
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
  });

  it('accepts a custom color prop', () => {
    render(<CrewIcon color="var(--color-warning)" />);
    const svg = screen.getByTestId('crew-icon');
    expect(svg).toBeTruthy();
  });
});
