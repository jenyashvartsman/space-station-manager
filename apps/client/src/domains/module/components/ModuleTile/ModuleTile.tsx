import { motion } from 'framer-motion';
import { StatusBadge } from '../../../../shared/components/StatusBadge/StatusBadge';
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
        <StatusBadge status={module.status} />
      </div>
      <div className={styles['module-tile__body']}>
        <span className={styles['module-tile__name']}>{module.name}</span>
      </div>
      <div className={styles['module-tile__footer']}>
        <span className={styles['module-tile__type']}>{module.type}</span>
        <span className={styles['module-tile__crew']}>{module.crewCount} crew</span>
      </div>
    </motion.div>
  );
}
