import { useRef } from 'react';
import { useMissionTimer } from './useMissionTimer';
import styles from './MissionTimer.module.scss';

interface MissionTimerProps {
  durationSeconds: number;
  elapsedSeconds: number;
}

export function MissionTimer({ durationSeconds, elapsedSeconds }: MissionTimerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useMissionTimer(svgRef, durationSeconds, elapsedSeconds);

  return (
    <div className={styles['mission-timer']} aria-label="mission countdown timer">
      <svg
        ref={svgRef}
        className={styles['mission-timer__svg']}
        data-testid="mission-timer-svg"
        aria-hidden="true"
      />
    </div>
  );
}
