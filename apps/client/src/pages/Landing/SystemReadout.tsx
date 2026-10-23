import { useEffect, useRef, useState } from 'react';
import styles from './Landing.module.scss';

interface SystemReadoutProps {
  label: string;
  targetValue: number;
  unit: string;
  delay?: number;
}

export function SystemReadout({ label, targetValue, unit, delay = 0 }: SystemReadoutProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const DURATION = 1200;

    const delayTimer = setTimeout(() => {
      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(eased * targetValue));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [targetValue, delay]);

  return (
    <div className={styles['landing__readout']}>
      <span className={styles['landing__readout-label']}>{label}</span>
      <span className={styles['landing__readout-value']}>
        {displayValue}
        {unit}
      </span>
    </div>
  );
}
