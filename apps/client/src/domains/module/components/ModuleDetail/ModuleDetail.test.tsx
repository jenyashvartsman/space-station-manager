import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { ModuleDetail } from './ModuleDetail';
import { antdTheme } from '../../../../shared/theme/antd.theme';
import type { ModuleDetail as ModuleDetailType } from '../../types/module.types';

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

const mockDetail: ModuleDetailType = {
  id: 'm1',
  stationId: 's1',
  type: 'life-support',
  name: 'Life Support Alpha',
  status: 'nominal',
  powerConsumption: 12,
  createdAt: '2026-01-01T00:00:00Z',
  crew: [
    {
      id: 'c1',
      stationId: 's1',
      name: 'Dr. Elena Vasquez',
      role: 'Scientist',
      status: 'active',
      health: 95,
      assignedModuleId: 'm1',
      assignedModuleName: 'Life Support Alpha',
      createdAt: '2026-01-01T00:00:00Z',
    },
  ],
};

function renderDrawer(detail: ModuleDetailType | null, loading = false) {
  return render(
    <ConfigProvider theme={antdTheme}>
      <ModuleDetail detail={detail} loading={loading} onClose={vi.fn()} />
    </ConfigProvider>,
  );
}

describe('ModuleDetail', () => {
  it('renders module name when detail is provided', () => {
    renderDrawer(mockDetail);
    expect(screen.getAllByText('Life Support Alpha').length).toBeGreaterThan(0);
  });

  it('renders the power consumption readout', () => {
    renderDrawer(mockDetail);
    expect(screen.getByText('12 kW')).toBeTruthy();
  });

  it('renders assigned crew names', () => {
    renderDrawer(mockDetail);
    expect(screen.getByText('Dr. Elena Vasquez')).toBeTruthy();
  });

  it('renders the type value', () => {
    renderDrawer(mockDetail);
    expect(screen.getByText('life-support')).toBeTruthy();
  });

  it('shows no-crew message when crew array is empty', () => {
    const noCrewDetail = { ...mockDetail, crew: [] };
    renderDrawer(noCrewDetail);
    expect(screen.getByText('No crew assigned')).toBeTruthy();
  });

  it('renders status options selector', () => {
    renderDrawer(mockDetail);
    expect(screen.getAllByText('NOMINAL').length).toBeGreaterThan(0);
  });
});
