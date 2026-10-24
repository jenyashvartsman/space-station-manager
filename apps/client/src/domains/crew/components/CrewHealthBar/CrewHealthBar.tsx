import { motion } from 'framer-motion';
import styles from './CrewHealthBar.module.scss';

interface CrewHealthBarProps {
  health: number;
}

function healthColorClass(health: number): string {
  if (health > 70) return styles['crew-health-bar__fill--nominal'];
  if (health >= 30) return styles['crew-health-bar__fill--warning'];
  return styles['crew-health-bar__fill--critical'];
}

export function CrewHealthBar({ health }: CrewHealthBarProps) {
  const clampedHealth = Math.max(0, Math.min(100, health));
  const colorClass = healthColorClass(clampedHealth);

  return (
    <div className={styles['crew-health-bar']} role="progressbar" aria-valuenow={clampedHealth} aria-valuemin={0} aria-valuemax={100} aria-label={`Health: ${clampedHealth}%`}>
      <div className={styles['crew-health-bar__track']}>
        <motion.div
          className={`${styles['crew-health-bar__fill']} ${colorClass}`}
          animate={{ width: `${clampedHealth}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <span className={styles['crew-health-bar__value']}>{clampedHealth}</span>
    </div>
  );
}
