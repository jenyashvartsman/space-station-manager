import type { MissionStatus } from '../../types/mission.types';

interface MissionBadgeProps {
  status: MissionStatus;
  size?: number;
}

const STATUS_COLOR: Record<MissionStatus, string> = {
  active: 'var(--color-nominal)',
  queued: 'var(--color-warning)',
  complete: 'var(--color-text-muted)',
  failed: 'var(--color-critical)',
};

export function MissionBadge({ status, size = 28 }: MissionBadgeProps) {
  const color = STATUS_COLOR[status];
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 1.5;
  const innerR = outerR * 0.55;
  const tickLen = outerR * 0.3;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      data-testid={`mission-badge-${status}`}
    >
      {/* Outer ring */}
      <circle
        cx={cx} cy={cy}
        r={outerR}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* Inner ring */}
      <circle
        cx={cx} cy={cy}
        r={innerR}
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Center dot */}
      <circle
        cx={cx} cy={cy}
        r="2"
        fill={color}
        opacity="0.9"
      />
      {/* Tick marks at N/S/E/W */}
      {/* North */}
      <line
        x1={cx} y1={cy - outerR}
        x2={cx} y2={cy - outerR + tickLen}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* South */}
      <line
        x1={cx} y1={cy + outerR}
        x2={cx} y2={cy + outerR - tickLen}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* West */}
      <line
        x1={cx - outerR} y1={cy}
        x2={cx - outerR + tickLen} y2={cy}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* East */}
      <line
        x1={cx + outerR} y1={cy}
        x2={cx + outerR - tickLen} y2={cy}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
