import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { StarField } from './StarField';
import { StationTitleReveal } from './StationTitleReveal';
import { SystemReadout } from './SystemReadout';
import styles from './Landing.module.scss';

const STATION_NAME = 'Kepler Station Alpha';

const NUMERIC_READOUTS = [
  { label: 'Crew', targetValue: 5, unit: '', delay: 0.8 },
  { label: 'Modules', targetValue: 6, unit: '', delay: 1.0 },
  { label: 'Power', targetValue: 78, unit: '%', delay: 1.2 },
] as const;

const ctaVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { delay: 1.8, duration: 0.4, ease: 'easeOut' as const } },
};

const statusVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 1.4, duration: 0.3 } },
};

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles['landing']}>
      <StarField />

      <div className={styles['landing__content']}>
        <StationTitleReveal title={STATION_NAME} />

        <div
          className={styles['landing__readouts']}
          role="group"
          aria-label="Station status readouts"
        >
          {NUMERIC_READOUTS.map(({ label, targetValue, unit, delay }) => (
            <SystemReadout
              key={label}
              label={label}
              targetValue={targetValue}
              unit={unit}
              delay={delay}
            />
          ))}

          <motion.div
            className={styles['landing__status-readout']}
            variants={statusVariants}
            initial="hidden"
            animate="visible"
          >
            <span className={styles['landing__status-label']}>Status</span>
            <span className={styles['landing__status-value']}>NOMINAL</span>
          </motion.div>
        </div>

        <motion.div variants={ctaVariants} initial="hidden" animate="visible">
          <Button
            className={styles['landing__enter-btn']}
            size="large"
            onClick={() => navigate('/station')}
            aria-label="Enter the station"
          >
            Enter Station
          </Button>
        </motion.div>

        <p className={styles['landing__mission-log']} role="status" aria-live="polite">
          MISSION LOG: ASTEROID SURVEY IN PROGRESS...
        </p>
      </div>
    </div>
  );
}
