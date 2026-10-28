import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMissionPolling } from '../../domains/mission/hooks/useMissionPolling';
import { useMissionStore } from '../../domains/mission/store/useMissionStore';
import { missionService } from '../../domains/mission/services/mission.service';
import { MissionItem } from '../../domains/mission/components/MissionItem/MissionItem';
import { MissionCreateForm } from '../../domains/mission/components/MissionCreateForm/MissionCreateForm';
import { SkeletonPanel } from '../../shared/components/SkeletonPanel/SkeletonPanel';
import { pageEnter, hudColumnEnter, panelContainer, panelItem } from '../../shared/motion/stationMotion';
import { stationCopy } from '../../shared/copy/stationCopy';
import styles from './MissionControl.module.scss';

function colEnter(i: number) {
  return {
    initial: hudColumnEnter.initial,
    animate: {
      ...hudColumnEnter.animate,
      transition: { ...hudColumnEnter.animate.transition, delay: i * 0.08 },
    },
  };
}

export function MissionControl() {
  const missions = useMissionStore((s) => s.missions);
  const updateMission = useMissionStore((s) => s.updateMission);
  const [createOpen, setCreateOpen] = useState(false);

  useMissionPolling();

  const active = missions.filter((m) => m.status === 'active');
  const queued = missions.filter((m) => m.status === 'queued');
  const completed = missions.filter((m) => m.status === 'complete' || m.status === 'failed');

  async function handleStart(id: string) {
    try {
      const updated = await missionService.updateMissionStatus(id, 'active');
      updateMission(updated);
    } catch {
      // non-fatal
    }
  }

  async function handleAbort(id: string) {
    try {
      const updated = await missionService.updateMissionStatus(id, 'failed');
      updateMission(updated);
    } catch {
      // non-fatal
    }
  }

  return (
    <motion.div className={styles['mission-control']} {...pageEnter}>
      {/* Active column */}
      <motion.div className={styles['mission-control__column']} data-column="active" {...colEnter(0)}>
        <div className={styles['mission-control__col-header']}>
          <span className={styles['mission-control__col-label']}>◈ {stationCopy.missions.colActive}</span>
          <span className={styles['mission-control__col-count']}>{active.length}</span>
        </div>
        {missions.length === 0 ? (
          <div className={styles['mission-control__col-body']} aria-label="Active missions">
            <SkeletonPanel height="80px" />
          </div>
        ) : (
          <motion.div
            className={styles['mission-control__col-body']}
            aria-label="Active missions"
            variants={panelContainer}
            initial="initial"
            animate="animate"
          >
            {active.map((mission) => (
              <motion.div key={mission.id} variants={panelItem}>
                <MissionItem mission={mission} onAbort={handleAbort} />
              </motion.div>
            ))}
            {active.length === 0 && (
              <p className={styles['mission-control__empty']} data-testid="active-empty">
                {stationCopy.missions.emptyActive}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Queued column */}
      <motion.div className={styles['mission-control__column']} data-column="queued" {...colEnter(1)}>
        <div className={styles['mission-control__col-header']}>
          <span className={styles['mission-control__col-label']}>◈ {stationCopy.missions.colQueued}</span>
          <span className={styles['mission-control__col-count']}>{queued.length}</span>
        </div>
        {missions.length === 0 ? (
          <div className={styles['mission-control__col-body']} aria-label="Queued missions">
            <SkeletonPanel height="80px" />
          </div>
        ) : (
          <motion.div
            className={styles['mission-control__col-body']}
            aria-label="Queued missions"
            variants={panelContainer}
            initial="initial"
            animate="animate"
          >
            {queued.map((mission) => (
              <motion.div key={mission.id} variants={panelItem}>
                <MissionItem mission={mission} onStart={handleStart} />
              </motion.div>
            ))}
            {queued.length === 0 && (
              <p className={styles['mission-control__empty']} data-testid="queued-empty">
                {stationCopy.missions.emptyQueued}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Completed column */}
      <motion.div className={styles['mission-control__column']} data-column="completed" {...colEnter(2)}>
        <div className={styles['mission-control__col-header']}>
          <span className={styles['mission-control__col-label']}>◈ {stationCopy.missions.colCompleted}</span>
          <span className={styles['mission-control__col-count']}>{completed.length}</span>
        </div>
        {missions.length === 0 ? (
          <div className={styles['mission-control__col-body']} aria-label="Completed missions">
            <SkeletonPanel height="80px" />
          </div>
        ) : (
          <motion.div
            className={styles['mission-control__col-body']}
            aria-label="Completed missions"
            variants={panelContainer}
            initial="initial"
            animate="animate"
          >
            {completed.map((mission) => (
              <motion.div key={mission.id} variants={panelItem}>
                <MissionItem mission={mission} />
              </motion.div>
            ))}
            {completed.length === 0 && (
              <p className={styles['mission-control__empty']} data-testid="completed-empty">
                {stationCopy.missions.emptyCompleted}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* New Mission button — full-width footer */}
      <div className={styles['mission-control__footer']}>
        <button
          className={styles['mission-control__new-mission-btn']}
          onClick={() => setCreateOpen(true)}
          data-testid="new-mission-button"
          aria-label="Create new mission"
        >
          {stationCopy.missions.newMission}
        </button>
      </div>

      <MissionCreateForm open={createOpen} onClose={() => setCreateOpen(false)} />
    </motion.div>
  );
}
