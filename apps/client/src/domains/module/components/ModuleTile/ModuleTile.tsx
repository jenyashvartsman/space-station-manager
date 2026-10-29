import { motion } from 'framer-motion';
import { StatusBadge } from '../../../../shared/components/StatusBadge/StatusBadge';
import { ModuleIcon } from '../ModuleIcon/ModuleIcon';
import type { ModuleIconType } from '../ModuleIcon/ModuleIcon';
import type { Module } from '../../types/module.types';
import styles from './ModuleTile.module.scss';

interface ModuleTileProps {
  module: Module;
}

const STATUS_GLOW: Record<string, string> = {
  critical: '0 0 12px var(--color-critical)',
  warning: '0 0 8px var(--color-warning)',
  nominal: '0 0 0px transparent',
  offline: '0 0 0px transparent',
};

function normalizeModuleType(type: string): ModuleIconType {
  const t = type.toLowerCase();
  if (t.includes('habitat') || t.includes('habitation') || t.includes('life') || t.includes('support')) return 'habitat';
  if (t.includes('power') || t.includes('energy') || t.includes('core')) return 'power';
  if (t.includes('science') || t.includes('lab') || t.includes('research')) return 'science';
  if (t.includes('medical') || t.includes('med')) return 'medical';
  if (t.includes('dock')) return 'docking';
  return 'unknown';
}

export function ModuleTile({ module }: ModuleTileProps) {
  return (
    <motion.div
      layout
      className={styles['module-tile']}
      animate={{ boxShadow: STATUS_GLOW[module.status] ?? STATUS_GLOW['nominal'] }}
      transition={{ duration: 0.4 }}
      data-testid={`module-tile-${module.id}`}
    >
      <div className={styles['module-tile__header']}>
        <ModuleIcon moduleType={normalizeModuleType(module.type)} size={20} />
        <StatusBadge status={module.status} />
      </div>
      <div className={styles['module-tile__body']}>
        <span className={styles['module-tile__name']}>{module.name}</span>
      </div>
      <div className={styles['module-tile__footer']}>
        <span className={styles['module-tile__type']}>{module.type}</span>
        <span className={styles['module-tile__crew']}>{module.crewCount} crew</span>
      </div>
      {module.repairing && (
        <div
          className={styles['module-tile__repair-track']}
          aria-label={`Repair progress: ${module.repairProgress}%`}
        >
          <motion.div
            className={styles['module-tile__repair-fill']}
            animate={{ width: `${module.repairProgress}%` }}
            transition={{ duration: 0.4, ease: 'linear' }}
          />
        </div>
      )}
    </motion.div>
  );
}
