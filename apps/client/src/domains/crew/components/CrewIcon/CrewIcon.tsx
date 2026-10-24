interface CrewIconProps {
  size?: number;
  color?: string;
}

export function CrewIcon({ size = 32, color = 'var(--color-nominal)' }: CrewIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      data-testid="crew-icon"
    >
      {/* Helmet dome */}
      <path
        d="M 7 19 L 7 13 C 7 6 25 6 25 13 L 25 19 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Visor window */}
      <rect
        x="10" y="11"
        width="12" height="7"
        rx="2.5"
        fill={color}
        fillOpacity="0.18"
        stroke={color}
        strokeWidth="1"
      />
      {/* Chin bar */}
      <rect
        x="7" y="20"
        width="18" height="5"
        rx="2"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}
