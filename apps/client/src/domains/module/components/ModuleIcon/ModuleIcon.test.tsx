import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModuleIcon } from './ModuleIcon';
import type { ModuleIconType } from './ModuleIcon';

const ALL_TYPES: ModuleIconType[] = [
  'habitat',
  'power',
  'science',
  'medical',
  'docking',
  'unknown',
];

describe('ModuleIcon', () => {
  it.each(ALL_TYPES)('renders the correct icon for moduleType "%s"', (moduleType) => {
    render(<ModuleIcon moduleType={moduleType} />);
    expect(screen.getByTestId(`module-icon-${moduleType}`)).toBeTruthy();
  });

  it('renders at the default size of 24', () => {
    render(<ModuleIcon moduleType="habitat" />);
    const svg = screen.getByTestId('module-icon-habitat');
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
  });

  it('renders at a custom size', () => {
    render(<ModuleIcon moduleType="power" size={16} />);
    const svg = screen.getByTestId('module-icon-power');
    expect(svg.getAttribute('width')).toBe('16');
    expect(svg.getAttribute('height')).toBe('16');
  });

  it('renders different icons for different module types', () => {
    const { rerender } = render(<ModuleIcon moduleType="habitat" />);
    expect(screen.getByTestId('module-icon-habitat')).toBeTruthy();

    rerender(<ModuleIcon moduleType="power" />);
    expect(screen.getByTestId('module-icon-power')).toBeTruthy();
  });
});
