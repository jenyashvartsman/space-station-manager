import { useId } from 'react';
import styles from './StationSchematic.module.scss';

interface StationSchematicProps {
  className?: string;
}

export function StationSchematic({ className }: StationSchematicProps) {
  const uid = useId();
  const hubGlowId = `${uid}-hub-glow`;
  const satGlowId = `${uid}-sat-glow`;

  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className={`${styles['station-schematic']} ${className ?? ''}`}
      aria-label="Space station schematic diagram"
      role="img"
      data-testid="station-schematic"
    >
      <defs>
        <filter id={hubGlowId} x="-80%" y="-80%" width="260%" height="260%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="5"
            floodColor="var(--color-nominal)"
            floodOpacity="0.55"
          />
        </filter>
        <filter id={satGlowId} x="-80%" y="-80%" width="260%" height="260%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="4"
            floodColor="var(--color-warning)"
            floodOpacity="0.45"
          />
        </filter>
      </defs>

      {/* Outer orbit ring — animated slow rotation */}
      <circle
        cx="200"
        cy="200"
        r="158"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="1"
        strokeDasharray="4 8"
        className={styles['station-schematic__orbit-ring']}
        data-testid="orbit-ring"
      />

      {/* Radial arm — Habitat ring (top) */}
      <line
        x1="200" y1="178"
        x2="200" y2="58"
        stroke="var(--color-border)"
        strokeWidth="1.5"
      />
      {/* Radial arm — Docking arm (bottom) */}
      <line
        x1="200" y1="222"
        x2="200" y2="342"
        stroke="var(--color-border)"
        strokeWidth="1.5"
      />
      {/* Radial arm — Power ring (left) */}
      <line
        x1="178" y1="200"
        x2="58" y2="200"
        stroke="var(--color-border)"
        strokeWidth="1.5"
      />
      {/* Radial arm — Science ring (right) */}
      <line
        x1="222" y1="200"
        x2="342" y2="200"
        stroke="var(--color-border)"
        strokeWidth="1.5"
      />

      {/* Module node — Habitat (top arm, ~100px from center) */}
      <rect
        x="183" y="103"
        width="34" height="14"
        rx="2"
        fill="var(--color-bg-surface)"
        stroke="var(--color-nominal)"
        strokeWidth="1"
      />
      <text
        x="212" y="105"
        fill="var(--color-text-muted)"
        fontSize="6"
        fontFamily="var(--font-data)"
        letterSpacing="0.06em"
      >
        HABITAT
      </text>

      {/* Module node — Docking (bottom arm, ~100px from center) */}
      <rect
        x="183" y="283"
        width="34" height="14"
        rx="2"
        fill="var(--color-bg-surface)"
        stroke="var(--color-border)"
        strokeWidth="1"
      />
      <text
        x="212" y="285"
        fill="var(--color-text-muted)"
        fontSize="6"
        fontFamily="var(--font-data)"
        letterSpacing="0.06em"
      >
        DOCK
      </text>

      {/* Module node — Power (left arm, ~100px from center) */}
      <rect
        x="97" y="192"
        width="14" height="16"
        rx="2"
        fill="var(--color-bg-surface)"
        stroke="var(--color-warning)"
        strokeWidth="1"
      />

      {/* Module node — Science (right arm, ~100px from center) */}
      <rect
        x="289" y="192"
        width="14" height="16"
        rx="2"
        fill="var(--color-bg-surface)"
        stroke="var(--color-border)"
        strokeWidth="1"
      />

      {/* Arm labels */}
      <text
        x="66" y="197"
        fill="var(--color-text-muted)"
        fontSize="6"
        fontFamily="var(--font-data)"
        letterSpacing="0.06em"
      >
        PWR
      </text>
      <text
        x="308" y="197"
        fill="var(--color-text-muted)"
        fontSize="6"
        fontFamily="var(--font-data)"
        letterSpacing="0.06em"
      >
        SCI
      </text>

      {/* Satellite circles at arm ends */}
      <circle
        cx="200" cy="52"
        r="7"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-warning)"
        strokeWidth="1.5"
        filter={`url(#${satGlowId})`}
        data-testid="satellite-top"
      />
      <circle
        cx="200" cy="348"
        r="7"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-border)"
        strokeWidth="1.5"
        data-testid="satellite-bottom"
      />
      <circle
        cx="52" cy="200"
        r="7"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-border)"
        strokeWidth="1.5"
        data-testid="satellite-left"
      />
      <circle
        cx="348" cy="200"
        r="7"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-border)"
        strokeWidth="1.5"
        data-testid="satellite-right"
      />

      {/* Crosshair guide lines (±40px from center) */}
      <line
        x1="160" y1="200" x2="240" y2="200"
        stroke="var(--color-border)"
        strokeWidth="0.75"
        strokeDasharray="3 5"
      />
      <line
        x1="200" y1="160" x2="200" y2="240"
        stroke="var(--color-border)"
        strokeWidth="0.75"
        strokeDasharray="3 5"
      />

      {/* Central hub — outer ring */}
      <circle
        cx="200" cy="200"
        r="20"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-nominal)"
        strokeWidth="1.5"
        filter={`url(#${hubGlowId})`}
        data-testid="hub-circle"
      />
      {/* Central hub — inner dot */}
      <circle
        cx="200" cy="200"
        r="5"
        fill="var(--color-nominal)"
      />
    </svg>
  );
}
