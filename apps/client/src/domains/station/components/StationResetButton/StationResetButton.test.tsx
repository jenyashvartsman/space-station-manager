import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigProvider, Modal } from 'antd';
import { StationResetButton } from './StationResetButton';
import { antdTheme } from '../../../../shared/theme/antd.theme';

vi.mock('antd', async () => {
  const antd = await vi.importActual<typeof import('antd')>('antd');
  return {
    ...antd,
    Modal: {
      ...antd.Modal,
      confirm: vi.fn(),
    },
  };
});

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

function wrap(ui: React.ReactElement) {
  return render(<ConfigProvider theme={antdTheme}>{ui}</ConfigProvider>);
}

describe('StationResetButton', () => {
  it('renders the reset button', () => {
    wrap(<StationResetButton />);
    expect(screen.getByTestId('station-reset-button')).toBeTruthy();
  });

  it('button label is RESET STATION', () => {
    wrap(<StationResetButton />);
    expect(screen.getByText('RESET STATION')).toBeTruthy();
  });

  it('clicking the button opens a confirmation modal', () => {
    wrap(<StationResetButton />);
    fireEvent.click(screen.getByTestId('station-reset-button'));
    expect(Modal.confirm).toHaveBeenCalledOnce();
  });

  it('confirmation modal is called with reset title', () => {
    wrap(<StationResetButton />);
    fireEvent.click(screen.getByTestId('station-reset-button'));
    expect(Modal.confirm).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'RESET STATION?' }),
    );
  });

  it('button is not disabled by default', () => {
    wrap(<StationResetButton />);
    const btn = screen.getByTestId('station-reset-button') as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });
});
