import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { CrewCard } from './CrewCard';
import { antdTheme } from '../../../../shared/theme/antd.theme';
import type { CrewMember } from '../../types/crew.types';

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

const mockMember: CrewMember = {
  id: 'c1',
  stationId: 's1',
  name: 'Dr. Elena Vasquez',
  role: 'Scientist',
  status: 'active',
  health: 95,
  assignedModuleId: 'm1',
  assignedModuleName: 'Research Lab',
  createdAt: '2026-01-01T00:00:00Z',
};

function renderCard(member: CrewMember = mockMember) {
  return render(
    <ConfigProvider theme={antdTheme}>
      <CrewCard member={member} />
    </ConfigProvider>,
  );
}

describe('CrewCard', () => {
  it('renders the crew member name', () => {
    renderCard();
    expect(screen.getByText('Dr. Elena Vasquez')).toBeTruthy();
  });

  it('renders the role label', () => {
    renderCard();
    expect(screen.getByText('SCIENTIST')).toBeTruthy();
  });

  it('renders the health bar', () => {
    renderCard();
    const bar = screen.getByRole('progressbar');
    expect(bar).toBeTruthy();
    expect(bar.getAttribute('aria-valuenow')).toBe('95');
  });

  it('renders the assigned module name', () => {
    renderCard();
    expect(screen.getByText('Module: Research Lab')).toBeTruthy();
  });

  it('renders "Unassigned" when no module is assigned', () => {
    renderCard({ ...mockMember, assignedModuleId: null, assignedModuleName: null });
    expect(screen.getByText('Module: Unassigned')).toBeTruthy();
  });

  it('renders with injured status dot', () => {
    renderCard({ ...mockMember, status: 'injured' });
    expect(screen.getByTestId('crew-card-c1')).toBeTruthy();
  });
});
