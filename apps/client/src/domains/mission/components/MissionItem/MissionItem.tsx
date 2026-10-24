import { Button } from 'antd';
import { MissionTimer } from '../MissionTimer/MissionTimer';
import styles from './MissionItem.module.scss';
import type { Mission } from '../../types/mission.types';

interface MissionItemProps {
  mission: Mission;
  onStart?: (id: string) => void;
  onAbort?: (id: string) => void;
}

function getElapsedSeconds(mission: Mission): number {
  if (!mission.startedAt) return 0;
  const elapsed = (Date.now() - new Date(mission.startedAt).getTime()) / 1000;
  return Math.min(elapsed, mission.durationSeconds);
}

function formatReward(reward: Mission['reward']): string {
  if (!reward) return '';
  const parts: string[] = [];
  const keys = ['oxygen', 'power', 'food', 'fuel', 'water'] as const;
  for (const key of keys) {
    const val = reward[key];
    if (val !== undefined && val !== 0) {
      parts.push(`${val > 0 ? '+' : ''}${val} ${key}`);
    }
  }
  return parts.join(', ');
}

function getTimeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hr ago';
  return `${hours} hrs ago`;
}

function statusClass(status: Mission['status']): string {
  switch (status) {
    case 'active':
      return 'status--nominal';
    case 'queued':
      return 'status--warning';
    case 'complete':
      return 'status--offline';
    case 'failed':
      return 'status--critical';
  }
}

export function MissionItem({ mission, onStart, onAbort }: MissionItemProps) {
  const elapsed = getElapsedSeconds(mission);
  const rewardText = formatReward(mission.reward);
  const isActive = mission.status === 'active';
  const isQueued = mission.status === 'queued';
  const isComplete = mission.status === 'complete';

  return (
    <div
      className={`${styles['mission-item']} ${styles[`mission-item--${mission.status}`]}`}
      data-testid={`mission-item-${mission.id}`}
    >
      {isActive && (
        <div className={styles['mission-item__timer']}>
          <MissionTimer durationSeconds={mission.durationSeconds} elapsedSeconds={elapsed} />
        </div>
      )}

      <div className={styles['mission-item__content']}>
        <div className={styles['mission-item__header']}>
          <span className={styles['mission-item__title']}>{mission.title.toUpperCase()}</span>
          <span
            className={`${styles['mission-item__badge']} status ${statusClass(mission.status)}`}
            data-testid={`mission-status-${mission.id}`}
          >
            {mission.status.toUpperCase()}
          </span>
        </div>

        {mission.description && (
          <p className={styles['mission-item__description']}>{mission.description}</p>
        )}

        {rewardText && (
          <p className={styles['mission-item__reward']}>Reward: {rewardText}</p>
        )}

        {isComplete && mission.completedAt && (
          <p className={`${styles['mission-item__completed-at']} text--muted`}>
            Completed {getTimeAgo(mission.completedAt)}
          </p>
        )}

        <div className={styles['mission-item__actions']}>
          {isQueued && onStart && (
            <Button
              size="small"
              type="primary"
              onClick={() => onStart(mission.id)}
              data-testid={`mission-start-${mission.id}`}
            >
              START
            </Button>
          )}
          {isActive && onAbort && (
            <Button
              size="small"
              danger
              onClick={() => onAbort(mission.id)}
              data-testid={`mission-abort-${mission.id}`}
            >
              ABORT
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
