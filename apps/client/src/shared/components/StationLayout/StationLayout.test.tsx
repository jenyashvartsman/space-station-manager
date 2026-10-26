import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StationLayout } from './StationLayout';

function renderLayout(initialPath = '/station') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <StationLayout />
    </MemoryRouter>,
  );
}

describe('StationLayout', () => {
  it('renders the station callsign in the top bar', () => {
    renderLayout();
    expect(screen.getByText(/KEPLER STATION ALPHA/i)).toBeTruthy();
  });

  it('renders STATUS: NOMINAL in the top bar', () => {
    renderLayout();
    expect(screen.getByText(/STATUS: NOMINAL/i)).toBeTruthy();
  });

  it('renders all 6 bottom nav links', () => {
    renderLayout();
    const nav = screen.getByRole('navigation', { name: /station navigation/i });
    const links = nav.querySelectorAll('a');
    expect(links.length).toBe(6);
  });

  it('renders DASH nav label', () => {
    renderLayout();
    expect(screen.getByText('DASH')).toBeTruthy();
  });

  it('renders CREW nav label', () => {
    renderLayout();
    expect(screen.getByText('CREW')).toBeTruthy();
  });

  it('renders MODULES nav label', () => {
    renderLayout();
    expect(screen.getByText('MODULES')).toBeTruthy();
  });

  it('renders RESOURCES nav label', () => {
    renderLayout();
    expect(screen.getByText('RESOURCES')).toBeTruthy();
  });

  it('renders OPS nav label', () => {
    renderLayout();
    expect(screen.getByText('OPS')).toBeTruthy();
  });

  it('renders LOG nav label', () => {
    renderLayout();
    expect(screen.getByText('LOG')).toBeTruthy();
  });

  it('renders children inside the main content area', () => {
    render(
      <MemoryRouter initialEntries={['/station']}>
        <StationLayout />
      </MemoryRouter>,
    );
    const main = document.querySelector('main');
    expect(main).toBeTruthy();
  });
});
