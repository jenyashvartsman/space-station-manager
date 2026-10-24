import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { AppRouter } from './router';

// Mock page modules — routing tests verify navigation, not page internals
vi.mock('../pages/Landing/Landing', () => ({
  Landing: () => <div data-testid="page-landing">Landing Page</div>,
}));

vi.mock('../pages/StationDashboard/StationDashboard', () => ({
  StationDashboard: () => <div data-testid="page-station">Station Dashboard</div>,
}));

vi.mock('../pages/CrewRoster/CrewRoster', () => ({
  CrewRoster: () => <div data-testid="page-crew">Crew Roster</div>,
}));

vi.mock('../pages/ModuleManagement/ModuleManagement', () => ({
  ModuleManagement: () => <div data-testid="page-modules">Module Management</div>,
}));

vi.mock('../pages/ResourcePanel/ResourcePanel', () => ({
  ResourcePanel: () => <div data-testid="page-resources">Resource Panel</div>,
}));

vi.mock('../pages/MissionControl/MissionControl', () => ({
  MissionControl: () => <div data-testid="page-missions">Mission Control</div>,
}));

vi.mock('../pages/EventLog/EventLog', () => ({
  EventLog: () => <div data-testid="page-events">Event Log</div>,
}));

vi.mock('../shared/components/StationLayout/StationLayout', () => ({
  StationLayout: () => (
    <div data-testid="station-layout">
      <Outlet />
    </div>
  ),
}));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

function renderRouter(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Suspense fallback={<div>Loading…</div>}>
        <AppRouter />
      </Suspense>
    </MemoryRouter>,
  );
}

describe('AppRouter', () => {
  it('navigating to / renders the Landing page', async () => {
    renderRouter('/');
    await waitFor(() => {
      expect(screen.getByTestId('page-landing')).toBeTruthy();
    });
  });

  it('navigating to /station renders the StationDashboard', async () => {
    renderRouter('/station');
    await waitFor(() => {
      expect(screen.getByTestId('page-station')).toBeTruthy();
    });
  });

  it('navigating to an unknown route redirects to /', async () => {
    renderRouter('/unknown-path-xyz');
    await waitFor(() => {
      expect(screen.getByTestId('page-landing')).toBeTruthy();
    });
  });
});
