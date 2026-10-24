import { useState } from 'react';
import { Button } from 'antd';
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
      <header className={styles['mission-control__header']}>
        <h1 className={styles['mission-control__title']}>MISSION CONTROL</h1>
        <Button
          type="primary"
          onClick={() => setCreateOpen(true)}
          data-testid="new-mission-button"
        >
          + NEW MISSION
        </Button>
      </header>

      <section className={styles['mission-control__section']} aria-label="Active missions">
        <h2 className={styles['mission-control__section-title']}>ACTIVE</h2>
        <div className={styles['mission-control__list']}>
          {active.map((mission) => (
            <MissionItem key={mission.id} mission={mission} onAbort={handleAbort} />
          ))}
          {active.length === 0 && (
            <p className={styles['mission-control__empty']} data-testid="active-empty">
              No active missions.
            </p>
          )}
        </div>
      </section>

      <section className={styles['mission-control__section']} aria-label="Queued missions">
        <h2 className={styles['mission-control__section-title']}>QUEUED</h2>
        <div className={styles['mission-control__list']}>
          {queued.map((mission) => (
            <MissionItem key={mission.id} mission={mission} onStart={handleStart} />
          ))}
          {queued.length === 0 && (
            <p className={styles['mission-control__empty']} data-testid="queued-empty">
              No queued missions.
            </p>
          )}
        </div>
      </section>

      <section className={styles['mission-control__section']} aria-label="Completed missions">
        <h2 className={styles['mission-control__section-title']}>COMPLETED</h2>
        <div className={styles['mission-control__list']}>
          {completed.map((mission) => (
            <MissionItem key={mission.id} mission={mission} />
          ))}
          {completed.length === 0 && (
            <p className={styles['mission-control__empty']} data-testid="completed-empty">
              No completed missions.
            </p>
          )}
        </div>
      </section>

      <MissionCreateForm open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
