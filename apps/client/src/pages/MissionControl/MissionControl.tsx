import { useState } from 'react';
import { useMissionPolling } from '../../domains/mission/hooks/useMissionPolling';
import { useMissionStore } from '../../domains/mission/store/useMissionStore';
import { missionService } from '../../domains/mission/services/mission.service';
import { MissionItem } from '../../domains/mission/components/MissionItem/MissionItem';
import { MissionCreateForm } from '../../domains/mission/components/MissionCreateForm/MissionCreateForm';
import styles from './MissionControl.module.scss';

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
    <div className={styles['mission-control']}>
      {/* Active column */}
      <div className={styles['mission-control__column']} data-column="active">
        <div className={styles['mission-control__col-header']}>
          <span className={styles['mission-control__col-label']}>◈ ACTIVE OPS</span>
          <span className={styles['mission-control__col-count']}>{active.length}</span>
        </div>
        <div className={styles['mission-control__col-body']} aria-label="Active missions">
          {active.map((mission) => (
            <MissionItem key={mission.id} mission={mission} onAbort={handleAbort} />
          ))}
          {active.length === 0 && (
            <p className={styles['mission-control__empty']} data-testid="active-empty">
              No active missions.
            </p>
          )}
        </div>
      </div>

      {/* Queued column */}
      <div className={styles['mission-control__column']} data-column="queued">
        <div className={styles['mission-control__col-header']}>
          <span className={styles['mission-control__col-label']}>◈ QUEUED OPS</span>
          <span className={styles['mission-control__col-count']}>{queued.length}</span>
        </div>
        <div className={styles['mission-control__col-body']} aria-label="Queued missions">
          {queued.map((mission) => (
            <MissionItem key={mission.id} mission={mission} onStart={handleStart} />
          ))}
          {queued.length === 0 && (
            <p className={styles['mission-control__empty']} data-testid="queued-empty">
              No queued missions.
            </p>
          )}
        </div>
      </div>

      {/* Completed column */}
      <div className={styles['mission-control__column']} data-column="completed">
        <div className={styles['mission-control__col-header']}>
          <span className={styles['mission-control__col-label']}>◈ COMPLETED OPS</span>
          <span className={styles['mission-control__col-count']}>{completed.length}</span>
        </div>
        <div className={styles['mission-control__col-body']} aria-label="Completed missions">
          {completed.map((mission) => (
            <MissionItem key={mission.id} mission={mission} />
          ))}
          {completed.length === 0 && (
            <p className={styles['mission-control__empty']} data-testid="completed-empty">
              No completed missions.
            </p>
          )}
        </div>
      </div>

      {/* New Mission button — full-width footer */}
      <div className={styles['mission-control__footer']}>
        <button
          className={styles['mission-control__new-mission-btn']}
          onClick={() => setCreateOpen(true)}
          data-testid="new-mission-button"
          aria-label="Create new mission"
        >
          + NEW MISSION
        </button>
      </div>

      <MissionCreateForm open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
