import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Select, notification } from 'antd';
import { motion } from 'framer-motion';
import { useModulePolling } from '../../domains/module/hooks/useModulePolling';
import { useModuleStore } from '../../domains/module/store/useModuleStore';
import { moduleService } from '../../domains/module/services/module.service';
import { ModuleTile } from '../../domains/module/components/ModuleTile/ModuleTile';
import { PowerConsumptionChart } from '../../domains/module/components/PowerConsumptionChart/PowerConsumptionChart';
import { StatusBadge } from '../../shared/components/StatusBadge/StatusBadge';
import { SkeletonPanel } from '../../shared/components/SkeletonPanel/SkeletonPanel';
import { pageEnter, hudBoot, panelContainer, panelItem } from '../../shared/motion/stationMotion';
import type { Module, ModuleDetail as ModuleDetailType, ModuleStatus } from '../../domains/module/types/module.types';
import styles from './ModuleManagement.module.scss';

type SortOption = 'status' | 'name' | 'power';

const SORT_OPTIONS: SortOption[] = ['status', 'name', 'power'];

const STATUS_SORT_ORDER: Record<string, number> = {
  critical: 0,
  warning: 1,
  nominal: 2,
  offline: 3,
};

const STATUS_BORDER_COLOR: Record<string, string> = {
  nominal: 'var(--color-nominal)',
  warning: 'var(--color-warning)',
  critical: 'var(--color-critical)',
  offline: 'var(--color-offline)',
};

const STATUS_SELECT_OPTIONS: { value: ModuleStatus; label: string }[] = [
  { value: 'nominal', label: 'NOMINAL' },
  { value: 'warning', label: 'WARNING' },
  { value: 'critical', label: 'CRITICAL' },
  { value: 'offline', label: 'OFFLINE' },
];

function sortModules(modules: Module[], by: SortOption): Module[] {
  return [...modules].sort((a, b) => {
    switch (by) {
      case 'status':
        return (STATUS_SORT_ORDER[a.status] ?? 2) - (STATUS_SORT_ORDER[b.status] ?? 2);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'power':
        return b.powerConsumption - a.powerConsumption;
      default:
        return 0;
    }
  });
}

export function ModuleManagement() {
  const modules = useModuleStore((s) => s.modules);
  const updateModule = useModuleStore((s) => s.updateModule);
  const { id: selectedId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<ModuleDetailType | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ModuleStatus>('nominal');
  const [saving, setSaving] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('status');

  useModulePolling();

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    moduleService
      .getModule(selectedId)
      .then((d) => {
        setDetail(d);
        setCurrentStatus(d.status);
      })
      .catch(() => setDetail(null))
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  function handleTileClick(moduleId: string) {
    navigate(`/modules/${moduleId}`);
  }

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

  const sortedModules = sortModules(modules, sortBy);

  return (
    <motion.div className={styles['module-management']} {...pageEnter}>
      {/* Left panel — Module Systems */}
      <motion.div className={styles['module-management__panel']} data-panel="systems" {...hudBoot}>
        <div className={styles['module-management__col-header']}>
          <span className={styles['module-management__col-label']}>◈ MODULE SYSTEMS</span>
          <span className={styles['module-management__count']}>{modules.length} modules</span>
        </div>

        {modules.length === 0 ? (
          <SkeletonPanel height="200px" />
        ) : (
          <motion.div
            className={styles['module-management__tile-grid']}
            variants={panelContainer}
            initial="initial"
            animate="animate"
          >
            {sortedModules.map((module) => (
              <motion.button
                key={module.id}
                className={`${styles['module-management__tile-btn']} ${
                  selectedId === module.id ? styles['module-management__tile-btn--selected'] : ''
                }`}
                style={{ borderLeftColor: STATUS_BORDER_COLOR[module.status] ?? STATUS_BORDER_COLOR['offline'] }}
                onClick={() => handleTileClick(module.id)}
                aria-label={`Open details for ${module.name}`}
                data-testid={`module-btn-${module.id}`}
                variants={panelItem}
              >
                <ModuleTile module={module} />
              </motion.button>
            ))}
          </motion.div>
        )}

        <div className={styles['module-management__sort-row']}>
          <span className={styles['module-management__sort-label']}>SORT</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt}
              className={`${styles['module-management__sort-btn']} ${
                sortBy === opt ? styles['module-management__sort-btn--active'] : ''
              }`}
              onClick={() => setSortBy(opt)}
              data-testid={`sort-${opt}`}
            >
              {opt.toUpperCase()}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Right panel — System Detail */}
      <motion.div className={styles['module-management__panel']} data-panel="detail" {...hudBoot}>
        <div className={styles['module-management__col-header']}>
          <span className={styles['module-management__col-label']}>◈ SYSTEM DETAIL</span>
        </div>

        {!selectedId ? (
          <div className={styles['module-management__empty-detail']}>
            <span className={styles['module-management__empty-detail-text']}>
              SELECT A MODULE TO VIEW SYSTEM DETAIL
            </span>
          </div>
        ) : detailLoading ? (
          <div className={styles['module-management__detail-loading']}>
            <span className={styles['module-management__loading-text']}>LOADING…</span>
          </div>
        ) : detail ? (
          <div className={styles['module-management__detail']}>
            <h2
              className={styles['module-management__detail-name']}
              data-testid="detail-module-name"
            >
              {detail.name}
            </h2>

            <div className={styles['module-management__detail-row']}>
              <span className={styles['module-management__detail-label']}>TYPE</span>
              <span className={styles['module-management__detail-value']}>{detail.type}</span>
            </div>

            <div className={styles['module-management__detail-row']}>
              <span className={styles['module-management__detail-label']}>STATUS</span>
              <StatusBadge status={currentStatus} />
            </div>

            <div className={styles['module-management__detail-row']}>
              <span className={styles['module-management__detail-label']}>POWER</span>
              <span className={styles['module-management__detail-reading']}>
                {detail.powerConsumption} kW
              </span>
            </div>

            <div className={styles['module-management__detail-row']}>
              <span className={styles['module-management__detail-label']}>CHANGE STATUS</span>
              <Select
                value={currentStatus}
                options={STATUS_SELECT_OPTIONS}
                onChange={handleStatusChange}
                loading={saving}
                disabled={saving}
                style={{ width: '100%' }}
                aria-label="Change module status"
                data-testid="status-select"
              />
            </div>

            <div className={styles['module-management__detail-crew']}>
              <span className={styles['module-management__detail-label']}>ASSIGNED CREW</span>
              {detail.crew.length === 0 ? (
                <p className={styles['module-management__no-crew']}>No crew assigned</p>
              ) : (
                <ul className={styles['module-management__crew-list']}>
                  {detail.crew.map((member) => (
                    <li
                      key={member.id}
                      className={styles['module-management__crew-item']}
                      data-testid={`detail-crew-${member.id}`}
                    >
                      <span className={styles['module-management__crew-name']}>{member.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}

        {modules.length > 0 && (
          <div className={styles['module-management__chart-section']}>
            <span className={styles['module-management__chart-label']}>POWER CONSUMPTION</span>
            <PowerConsumptionChart modules={sortedModules} />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
