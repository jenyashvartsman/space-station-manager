import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ModuleManagement } from './ModuleManagement';
import { useModuleStore } from '../../domains/module/store/useModuleStore';
import { antdTheme } from '../../shared/theme/antd.theme';
import type { Module } from '../../domains/module/types/module.types';

vi.mock('../../domains/module/hooks/useModulePolling', () => ({
  useModulePolling: vi.fn(),
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

  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

const mockModules: Module[] = [
  { id: 'm1', stationId: 's1', type: 'life-support', name: 'Life Support Alpha', status: 'nominal', powerConsumption: 12, createdAt: '2026-01-01T00:00:00Z', crewCount: 2, repairing: false, repairProgress: 0 },
  { id: 'm2', stationId: 's1', type: 'engineering', name: 'Engineering Bay', status: 'warning', powerConsumption: 24, createdAt: '2026-01-01T00:00:00Z', crewCount: 3, repairing: false, repairProgress: 0 },
  { id: 'm3', stationId: 's1', type: 'research', name: 'Research Lab', status: 'critical', powerConsumption: 18, createdAt: '2026-01-01T00:00:00Z', crewCount: 1, repairing: false, repairProgress: 0 },
  { id: 'm4', stationId: 's1', type: 'medical', name: 'Medical Bay', status: 'offline', powerConsumption: 0, createdAt: '2026-01-01T00:00:00Z', crewCount: 0, repairing: false, repairProgress: 0 },
  { id: 'm5', stationId: 's1', type: 'command', name: 'Command Center', status: 'nominal', powerConsumption: 30, createdAt: '2026-01-01T00:00:00Z', crewCount: 4, repairing: false, repairProgress: 0 },
  { id: 'm6', stationId: 's1', type: 'hydroponics', name: 'Hydroponics Bay', status: 'warning', powerConsumption: 8, createdAt: '2026-01-01T00:00:00Z', crewCount: 1, repairing: false, repairProgress: 0 },
];

function renderPage(path = '/modules') {
  useModuleStore.setState({ modules: mockModules, updateModule: useModuleStore.getState().updateModule });
  return render(
    <ConfigProvider theme={antdTheme}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/modules" element={<ModuleManagement />} />
          <Route path="/modules/:id" element={<ModuleManagement />} />
        </Routes>
      </MemoryRouter>
    </ConfigProvider>,
  );
}

describe('ModuleManagement', () => {
  it('renders column headings: MODULE SYSTEMS and SYSTEM DETAIL', () => {
    renderPage();
    expect(screen.getByText(/◈ MODULE SYSTEMS/)).toBeTruthy();
    expect(screen.getByText(/◈ SYSTEM DETAIL/)).toBeTruthy();
  });

  it('right panel shows SELECT A MODULE message by default', () => {
    renderPage();
    expect(screen.getByText('SELECT A MODULE TO VIEW SYSTEM DETAIL')).toBeTruthy();
  });

  it('renders a tile for each module', () => {
    renderPage();
    mockModules.forEach((m) => {
      expect(screen.getByTestId(`module-tile-${m.id}`)).toBeTruthy();
    });
  });

  it('renders the module count', () => {
    renderPage();
    expect(screen.getByText('6 modules')).toBeTruthy();
  });

  it('renders the power consumption chart', () => {
    renderPage();
    expect(screen.getByTestId('power-consumption-chart')).toBeTruthy();
  });

  it('renders clickable buttons for each module tile', () => {
    renderPage();
    mockModules.forEach((m) => {
      expect(screen.getByTestId(`module-btn-${m.id}`)).toBeTruthy();
    });
  });

  it('offline modules appear last under status sort', () => {
    renderPage();
    const btns = screen.getAllByTestId(/^module-btn-/);
    const lastBtn = btns[btns.length - 1];
    expect(lastBtn.getAttribute('data-testid')).toBe('module-btn-m4');
  });

  it('clicking a module tile shows that module name in the detail panel', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { ...mockModules[0], crew: [] },
      }),
    } as Response);

    renderPage();
    fireEvent.click(screen.getByTestId('module-btn-m1'));

    await waitFor(() => {
      expect(screen.getByTestId('detail-module-name')).toBeTruthy();
    });
    expect(screen.getByTestId('detail-module-name').textContent).toBe('Life Support Alpha');
  });
});
