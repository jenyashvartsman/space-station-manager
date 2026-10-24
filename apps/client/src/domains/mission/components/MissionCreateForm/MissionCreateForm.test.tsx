import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { MissionCreateForm } from './MissionCreateForm';
import { antdTheme } from '../../../../shared/theme/antd.theme';
import * as missionServiceModule from '../../services/mission.service';
import type { Mission } from '../../types/mission.types';

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

const mockMission: Mission = {
  id: 'm1',
  stationId: 's1',
  title: 'Test Mission',
  description: '',
  status: 'queued',
  durationSeconds: 300,
  startedAt: null,
  completedAt: null,
  reward: null,
};

function wrap(ui: React.ReactElement) {
  return render(<ConfigProvider theme={antdTheme}>{ui}</ConfigProvider>);
}

describe('MissionCreateForm', () => {
  it('renders form fields when open', () => {
    wrap(<MissionCreateForm open={true} onClose={vi.fn()} />);
    expect(screen.getByTestId('mission-title-input')).toBeTruthy();
    expect(screen.getByTestId('mission-duration-input')).toBeTruthy();
  });

  it('renders description field', () => {
    wrap(<MissionCreateForm open={true} onClose={vi.fn()} />);
    expect(screen.getByTestId('mission-description-input')).toBeTruthy();
  });

  it('renders all reward fields', () => {
    wrap(<MissionCreateForm open={true} onClose={vi.fn()} />);
    expect(screen.getByTestId('mission-reward-oxygen')).toBeTruthy();
    expect(screen.getByTestId('mission-reward-power')).toBeTruthy();
    expect(screen.getByTestId('mission-reward-food')).toBeTruthy();
    expect(screen.getByTestId('mission-reward-fuel')).toBeTruthy();
    expect(screen.getByTestId('mission-reward-water')).toBeTruthy();
  });

  it('renders submit button', () => {
    wrap(<MissionCreateForm open={true} onClose={vi.fn()} />);
    expect(screen.getByTestId('mission-submit-button')).toBeTruthy();
  });

  it('does not render form when closed', () => {
    wrap(<MissionCreateForm open={false} onClose={vi.fn()} />);
    expect(screen.queryByTestId('mission-create-form')).toBeNull();
  });

  it('calls missionService.createMission on valid submit', async () => {
    const createMission = vi
      .spyOn(missionServiceModule.missionService, 'createMission')
      .mockResolvedValue(mockMission);

    const onClose = vi.fn();
    wrap(<MissionCreateForm open={true} onClose={onClose} />);

    fireEvent.change(screen.getByTestId('mission-title-input'), {
      target: { value: 'Test Mission' },
    });
    fireEvent.change(screen.getByTestId('mission-duration-input'), {
      target: { value: '5' },
    });

    fireEvent.click(screen.getByTestId('mission-submit-button'));

    await waitFor(() => {
      expect(createMission).toHaveBeenCalled();
    });
  });

  it('calls onClose after successful submission', async () => {
    vi.spyOn(missionServiceModule.missionService, 'createMission').mockResolvedValue(mockMission);

    const onClose = vi.fn();
    wrap(<MissionCreateForm open={true} onClose={onClose} />);

    fireEvent.change(screen.getByTestId('mission-title-input'), {
      target: { value: 'Test Mission' },
    });
    fireEvent.change(screen.getByTestId('mission-duration-input'), {
      target: { value: '5' },
    });

    fireEvent.click(screen.getByTestId('mission-submit-button'));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
