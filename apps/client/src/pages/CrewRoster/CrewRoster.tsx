import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Row, Col } from 'antd';
import { useCrewPolling } from '../../domains/crew/hooks/useCrewPolling';
import { useModulePolling } from '../../domains/module/hooks/useModulePolling';
import { useCrewStore } from '../../domains/crew/store/useCrewStore';
import { CrewCard } from '../../domains/crew/components/CrewCard/CrewCard';
import type { CrewStatus } from '../../domains/crew/types/crew.types';
import styles from './CrewRoster.module.scss';

type FilterOption = CrewStatus | 'all';

const FILTER_OPTIONS: FilterOption[] = ['all', 'active', 'resting', 'injured', 'eva'];

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

export function CrewRoster() {
  const crew = useCrewStore((s) => s.crew);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  useCrewPolling();
  useModulePolling();

  const filteredCrew =
    activeFilter === 'all' ? crew : crew.filter((c) => c.status === activeFilter);

  return (
    <div className={styles['crew-roster']}>
      <header className={styles['crew-roster__header']}>
        <h1 className={styles['crew-roster__title']}>Crew Roster</h1>
        <span className={styles['crew-roster__count']}>{crew.length} crew</span>
      </header>

      <div className={styles['crew-roster__filters']} role="group" aria-label="Filter by status">
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter}
            className={`${styles['crew-roster__filter-btn']} ${
              activeFilter === filter ? styles['crew-roster__filter-btn--active'] : ''
            }`}
            onClick={() => setActiveFilter(filter)}
            aria-pressed={activeFilter === filter}
            data-testid={`filter-${filter}`}
          >
            {filter.toUpperCase()}
          </button>
        ))}
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <AnimatePresence>
          <Row gutter={[16, 16]}>
            {filteredCrew.map((member) => (
              <Col key={member.id} xs={24} sm={12} lg={6}>
                <CrewCard member={member} />
              </Col>
            ))}
            {filteredCrew.length === 0 && (
              <Col span={24}>
                <p className={styles['crew-roster__empty']}>No crew members match this filter.</p>
              </Col>
            )}
          </Row>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
