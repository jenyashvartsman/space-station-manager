import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Landing } from './Landing';
import { SystemReadout } from './SystemReadout';
import { antdTheme } from '../../shared/theme/antd.theme';

beforeAll(() => {
  // Canvas is not available in jsdom — stub getContext
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  // Ant Design needs matchMedia
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

function renderLanding() {
  return render(
    <ConfigProvider theme={antdTheme}>
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    </ConfigProvider>,
  );
}

describe('Landing', () => {
  it('renders without crashing', () => {
    renderLanding();
    // Title is split into individual char spans; query by the h1's aria-label
    expect(screen.getByRole('heading', { name: /kepler station alpha/i })).toBeTruthy();
  });

  it('"Enter Station" button is present', () => {
    renderLanding();
    expect(screen.getByRole('button', { name: /enter the station/i })).toBeTruthy();
  });

  it('renders the star field canvas', () => {
    renderLanding();
    expect(screen.getByTestId('starfield-canvas')).toBeTruthy();
  });

  it('renders the mission log text', () => {
    renderLanding();
    expect(screen.getByText(/operational command interface/i)).toBeTruthy();
  });
});

describe('SystemReadout', () => {
  it('renders the label', () => {
    render(<SystemReadout label="Crew" targetValue={5} unit="" />);
    expect(screen.getByText('Crew')).toBeTruthy();
  });

  it('renders the unit', () => {
    render(<SystemReadout label="Power" targetValue={78} unit="%" />);
    expect(screen.getByText('Power')).toBeTruthy();
  });
});
