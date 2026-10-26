import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { StarField } from './StarField';
import { StationTitleReveal } from './StationTitleReveal';
import { SystemReadout } from './SystemReadout';
import { StationSchematic } from '../../domains/station/components/StationSchematic/StationSchematic';
import { pageEnter, panelContainer, panelItem, hoverLift } from '../../shared/motion/stationMotion';
import styles from './Landing.module.scss';

const STATION_NAME = 'Kepler Station Alpha';

const NUMERIC_READOUTS = [
  { label: 'Crew', targetValue: 5, unit: '', delay: 0.8 },
  { label: 'Modules', targetValue: 6, unit: '', delay: 1.0 },
  { label: 'Power', targetValue: 78, unit: '%', delay: 1.2 },
] as const;

export function Landing() {
  const navigate = useNavigate();

  return (
    <motion.div className={styles['landing']} {...pageEnter}>
      <StarField />
      <StationSchematic className={styles['landing__schematic']} />

      <div className={styles['landing__content']}>
        {/* Hero: headline, mission log (subheadline), CTA */}
        <motion.div
          className={styles['landing__hero']}
          variants={panelContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={panelItem}>
            <StationTitleReveal title={STATION_NAME} />
          </motion.div>

          <motion.div variants={panelItem}>
            <p className={styles['landing__mission-log']} role="status" aria-live="polite">
              MISSION LOG: ASTEROID SURVEY IN PROGRESS...
            </p>
          </motion.div>

          <motion.div variants={panelItem}>
            <Button
              className={styles['landing__enter-btn']}
              size="large"
              onClick={() => navigate('/station')}
              aria-label="Enter the station"
            >
              Enter Station
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature cards: station status readouts */}
        <motion.div
          className={styles['landing__readouts']}
          variants={panelContainer}
          initial="initial"
          animate="animate"
          role="group"
          aria-label="Station status readouts"
        >
          {NUMERIC_READOUTS.map(({ label, targetValue, unit, delay }) => (
            <motion.div key={label} variants={panelItem} {...hoverLift}>
              <SystemReadout
                label={label}
                targetValue={targetValue}
                unit={unit}
                delay={delay}
              />
            </motion.div>
          ))}

          <motion.div
            className={styles['landing__status-readout']}
            variants={panelItem}
            {...hoverLift}
          >
            <span className={styles['landing__status-label']}>Status</span>
            <span className={styles['landing__status-value']}>NOMINAL</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
