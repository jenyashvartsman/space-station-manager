import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { StationLayout } from './StationLayout';
import { antdTheme } from '../../theme/antd.theme';

function renderLayout(initialPath = '/') {
  return render(
    <ConfigProvider theme={antdTheme}>
      <MemoryRouter initialEntries={[initialPath]}>
        <StationLayout />
      </MemoryRouter>
    </ConfigProvider>,
  );
}

describe('StationLayout', () => {
  it('renders the station name in the top bar', () => {
    renderLayout();
    expect(screen.getByText('Kepler Station Alpha')).toBeTruthy();
  });

  it('renders 6 sidebar navigation items', () => {
    renderLayout();
    const nav = screen.getByRole('menu', { name: /station navigation/i });
    const items = nav.querySelectorAll('[role="menuitem"]');
    expect(items.length).toBe(6);
  });

  it('renders a Dashboard nav link', () => {
    renderLayout();
    expect(screen.getByText('Dashboard')).toBeTruthy();
  });

  it('renders a Crew nav link', () => {
    renderLayout();
    expect(screen.getByText('Crew')).toBeTruthy();
  });

  it('renders a Modules nav link', () => {
    renderLayout();
    expect(screen.getByText('Modules')).toBeTruthy();
  });

  it('renders a Missions nav link', () => {
    renderLayout();
    expect(screen.getByText('Missions')).toBeTruthy();
  });

  it('renders a Resources nav link', () => {
    renderLayout();
    expect(screen.getByText('Resources')).toBeTruthy();
  });

  it('renders an Events nav link', () => {
    renderLayout();
    expect(screen.getByText('Events')).toBeTruthy();
  });
});
