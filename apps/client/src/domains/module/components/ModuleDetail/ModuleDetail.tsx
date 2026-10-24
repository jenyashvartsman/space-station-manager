import { useEffect, useState } from 'react';
import { Drawer, Select, notification, Spin } from 'antd';
import { StatusBadge } from '../../../../shared/components/StatusBadge/StatusBadge';
import { moduleService } from '../../services/module.service';
import { useModuleStore } from '../../store/useModuleStore';
import type { ModuleDetail as ModuleDetailType, ModuleStatus } from '../../types/module.types';
import styles from './ModuleDetail.module.scss';

interface ModuleDetailProps {
  detail: ModuleDetailType | null;
  loading: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS: { value: ModuleStatus; label: string }[] = [
  { value: 'nominal', label: 'NOMINAL' },
  { value: 'warning', label: 'WARNING' },
  { value: 'critical', label: 'CRITICAL' },
  { value: 'offline', label: 'OFFLINE' },
];

export function ModuleDetail({ detail, loading, onClose }: ModuleDetailProps) {
  const updateModule = useModuleStore((s) => s.updateModule);
  const [currentStatus, setCurrentStatus] = useState<ModuleStatus>('nominal');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (detail) setCurrentStatus(detail.status);
  }, [detail]);

  async function handleStatusChange(newStatus: ModuleStatus) {
    if (!detail) return;
    setSaving(true);
    try {
      const updated = await moduleService.updateModule(detail.id, { status: newStatus });
      setCurrentStatus(newStatus);
      updateModule(updated);
      notification.success({ message: 'Module status updated', duration: 2 });
    } catch {
      notification.error({ message: 'Failed to update module status', duration: 3 });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Drawer
      title={detail?.name ?? 'Module Detail'}
      placement="right"
      onClose={onClose}
      open={detail !== null || loading}
      width={400}
    >
      {loading && (
        <div className={styles['module-detail__loading']}>
          <Spin />
        </div>
      )}

      {!loading && detail && (
        <div className={styles['module-detail']}>
          <div className={styles['module-detail__row']}>
            <span className={styles['module-detail__label']}>TYPE</span>
            <span className={styles['module-detail__value']}>{detail.type}</span>
          </div>

          <div className={styles['module-detail__row']}>
            <span className={styles['module-detail__label']}>STATUS</span>
            <StatusBadge status={currentStatus} />
          </div>

          <div className={styles['module-detail__row']}>
            <span className={styles['module-detail__label']}>CHANGE STATUS</span>
            <Select
              value={currentStatus}
              options={STATUS_OPTIONS}
              onChange={handleStatusChange}
              loading={saving}
              disabled={saving}
              style={{ width: '100%' }}
              aria-label="Change module status"
              data-testid="status-select"
            />
          </div>

          <div className={styles['module-detail__row']}>
            <span className={styles['module-detail__label']}>POWER CONSUMPTION</span>
            <span className={`${styles['module-detail__reading']} text--reading`}>
              {detail.powerConsumption} kW
            </span>
          </div>

          <div className={styles['module-detail__crew-section']}>
            <span className={styles['module-detail__label']}>ASSIGNED CREW</span>
            {detail.crew.length === 0 ? (
              <p className={`${styles['module-detail__no-crew']} text--muted`}>
                No crew assigned
              </p>
            ) : (
              <ul className={styles['module-detail__crew-list']}>
                {detail.crew.map((member) => (
                  <li
                    key={member.id}
                    className={styles['module-detail__crew-item']}
                    data-testid={`detail-crew-${member.id}`}
                  >
                    <span className={styles['module-detail__crew-name']}>{member.name}</span>
                    <div
                      className={styles['module-detail__crew-health-track']}
                      aria-label={`Health: ${member.health}%`}
                    >
                      <div
                        className={styles['module-detail__crew-health-fill']}
                        style={{ width: `${member.health}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}
