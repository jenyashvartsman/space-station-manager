import { NavLink, Outlet } from 'react-router-dom';
import { HudUptime } from '../HudUptime/HudUptime';
import styles from './StationLayout.module.scss';

const NAV_TABS = [
  { to: '/station', glyph: '◉', label: 'DASH' },
  { to: '/crew', glyph: '✦', label: 'CREW' },
  { to: '/modules', glyph: '⬡', label: 'MODULES' },
  { to: '/resources', glyph: '◈', label: 'RESOURCES' },
  { to: '/missions', glyph: '⚑', label: 'OPS' },
  { to: '/events', glyph: '▤', label: 'LOG' },
];

export function StationLayout() {
  return (
    <div className={styles['hud-shell']}>
      <header className={styles['hud-shell__top-bar']}>
        <span className={styles['hud-shell__callsign']}>◈ KEPLER STATION ALPHA</span>
        <span className={styles['hud-shell__live-status']}>STATUS: NOMINAL</span>
        <HudUptime />
      </header>

      <main className={styles['hud-shell__main']}>
        <Outlet />
      </main>

      <nav className={styles['hud-shell__bottom-nav']} aria-label="Station navigation">
        {NAV_TABS.map(({ to, glyph, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [styles['hud-shell__nav-tab'], isActive ? styles['hud-shell__nav-tab--active'] : ''].join(' ')
            }
          >
            <span className={styles['hud-shell__nav-glyph']}>{glyph}</span>
            <span className={styles['hud-shell__nav-label']}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
