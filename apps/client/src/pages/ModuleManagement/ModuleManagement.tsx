import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Row, Col, Select } from 'antd';
import { useModulePolling } from '../../domains/module/hooks/useModulePolling';
import { useModuleStore } from '../../domains/module/store/useModuleStore';
import { moduleService } from '../../domains/module/services/module.service';
import { ModuleTile } from '../../domains/module/components/ModuleTile/ModuleTile';
import { ModuleDetail } from '../../domains/module/components/ModuleDetail/ModuleDetail';
import { PowerConsumptionChart } from '../../domains/module/components/PowerConsumptionChart/PowerConsumptionChart';
import type { Module, ModuleDetail as ModuleDetailType } from '../../domains/module/types/module.types';
import styles from './ModuleManagement.module.scss';

type SortOption = 'status' | 'name' | 'power';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'status', label: 'Sort: Status' },
  { value: 'name', label: 'Sort: Name' },
  { value: 'power', label: 'Sort: Power' },
];

const STATUS_SORT_ORDER: Record<string, number> = {
  critical: 0,
  warning: 1,
  nominal: 2,
  offline: 3,
};

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

const tileVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const containerVariants = {
  visible: { transition: { staggerChildren: 0.04 } },
};

export function ModuleManagement() {
  const modules = useModuleStore((s) => s.modules);
  const { id: selectedId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<ModuleDetailType | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
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
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  function handleTileClick(moduleId: string) {
    navigate(`/modules/${moduleId}`);
  }

  function handleDrawerClose() {
    setDetail(null);
    navigate('/modules');
  }

  const sortedModules = sortModules(modules, sortBy);

  return (
    <div className={styles['module-management']}>
      <header className={styles['module-management__header']}>
        <div className={styles['module-management__title-row']}>
          <h1 className={styles['module-management__title']}>Modules</h1>
          <span className={styles['module-management__count']}>{modules.length} modules</span>
        </div>
        <Select
          value={sortBy}
          options={SORT_OPTIONS}
          onChange={setSortBy}
          style={{ width: 160 }}
          aria-label="Sort modules"
        />
      </header>

      {modules.length > 0 && (
        <section className={styles['module-management__chart-section']}>
          <h2 className={styles['module-management__section-title']}>Power Consumption</h2>
          <PowerConsumptionChart modules={sortedModules} />
        </section>
      )}

      <section className={styles['module-management__grid-section']}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <AnimatePresence>
            <Row gutter={[16, 16]}>
              {sortedModules.map((module) => (
                <Col key={module.id} xs={24} sm={12} lg={8} xl={6}>
                  <motion.button
                    variants={tileVariants}
                    className={styles['module-management__tile-btn']}
                    onClick={() => handleTileClick(module.id)}
                    aria-label={`Open details for ${module.name}`}
                    data-testid={`module-btn-${module.id}`}
                  >
                    <ModuleTile module={module} />
                  </motion.button>
                </Col>
              ))}
            </Row>
          </AnimatePresence>
        </motion.div>
      </section>

      <ModuleDetail
        detail={detail}
        loading={detailLoading}
        onClose={handleDrawerClose}
      />
    </div>
  );
}
