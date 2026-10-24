export type ModuleIconType =
  | 'habitat'
  | 'power'
  | 'science'
  | 'medical'
  | 'docking'
  | 'unknown';

interface ModuleIconProps {
  moduleType: ModuleIconType;
  size?: number;
}

function HabitatIcon() {
  return (
    <>
      {/* Roof */}
      <polyline
        points="3,11 12,3 21,11"
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Building body */}
      <rect
        x="5" y="11"
        width="14" height="10"
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
      />
      {/* Door */}
      <rect
        x="10" y="16"
        width="4" height="5"
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth="1"
      />
    </>
  );
}

function PowerIcon() {
  return (
    <polyline
      points="15,2 9,13 13,13 9,22 18,10 14,10 18,2"
      fill="none"
      stroke="var(--color-text-muted)"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}

function ScienceIcon() {
  return (
    <>
      {/* Flask neck */}
      <line x1="10" y1="3" x2="14" y2="3" stroke="var(--color-text-muted)" strokeWidth="1.5" />
      {/* Flask body */}
      <path
        d="M 10 3 L 10 11 L 5 20 Q 5 22 7 22 L 17 22 Q 19 22 19 20 L 14 11 L 14 3"
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Bubbles */}
      <circle cx="11" cy="18" r="1" fill="var(--color-text-muted)" />
      <circle cx="14" cy="15" r="1" fill="var(--color-text-muted)" />
    </>
  );
}

function MedicalIcon() {
  return (
    <>
      {/* Vertical bar */}
      <rect
        x="10" y="3"
        width="4" height="18"
        rx="1"
        fill="var(--color-text-muted)"
      />
      {/* Horizontal bar */}
      <rect
        x="3" y="10"
        width="18" height="4"
        rx="1"
        fill="var(--color-text-muted)"
      />
    </>
  );
}

function DockingIcon() {
  return (
    <>
      {/* Left upper clamp */}
      <path
        d="M 3 7 L 3 4 L 9 4 L 9 7"
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Left lower clamp */}
      <path
        d="M 3 17 L 3 20 L 9 20 L 9 17"
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right upper clamp */}
      <path
        d="M 15 7 L 15 4 L 21 4 L 21 7"
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right lower clamp */}
      <path
        d="M 15 17 L 15 20 L 21 20 L 21 17"
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Center docking point */}
      <circle cx="12" cy="12" r="2" fill="var(--color-text-muted)" />
    </>
  );
}

function UnknownIcon() {
  return (
    <>
      <circle
        cx="12" cy="12"
        r="9"
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
      />
      <path
        d="M 9 9.5 Q 9 7 12 7 Q 15 7 15 9.5 Q 15 12 12 13.5"
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1" fill="var(--color-text-muted)" />
    </>
  );
}

function getIconComponent(moduleType: ModuleIconType) {
  const map = {
    habitat: HabitatIcon,
    power: PowerIcon,
    science: ScienceIcon,
    medical: MedicalIcon,
    docking: DockingIcon,
    unknown: UnknownIcon,
  };
  return map[moduleType] ?? UnknownIcon;
}

export function ModuleIcon({ moduleType, size = 24 }: ModuleIconProps) {
  const IconContent = getIconComponent(moduleType);

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      data-testid={`module-icon-${moduleType}`}
    >
      <IconContent />
    </svg>
  );
}
