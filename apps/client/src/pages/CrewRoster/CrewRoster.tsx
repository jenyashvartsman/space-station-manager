import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCrewPolling } from '../../domains/crew/hooks/useCrewPolling';
import { useModulePolling } from '../../domains/module/hooks/useModulePolling';
import { useCrewStore } from '../../domains/crew/store/useCrewStore';
import { CrewHealthBar } from '../../domains/crew/components/CrewHealthBar/CrewHealthBar';
import { CrewAssignmentSelect } from '../../domains/crew/components/CrewAssignmentSelect/CrewAssignmentSelect';
import { pageEnter, hudBoot, panelContainer, panelItem } from '../../shared/motion/stationMotion';
import { stationCopy } from '../../shared/copy/stationCopy';
import type { CrewStatus } from '../../domains/crew/types/crew.types';
import styles from './CrewRoster.module.scss';

type FilterOption = CrewStatus | 'all';

const FILTER_OPTIONS: FilterOption[] = ['all', 'active', 'resting', 'injured', 'eva'];

const STATUS_DOT_CLASS: Record<string, string> = {
  active: 'nominal',
  resting: 'offline',
  injured: 'critical',
  eva: 'warning',
};

export function CrewRoster() {
  const crew = useCrewStore((s) => s.crew);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null);

  useCrewPolling();
  useModulePolling();

  const filteredCrew =
    activeFilter === 'all' ? crew : crew.filter((c) => c.status === activeFilter);

  const selectedMember = selectedCrewId
    ? crew.find((c) => c.id === selectedCrewId) ?? null
    : null;

  return (
    <motion.div className={styles['crew-roster']} {...pageEnter}>
      {/* Left panel — Personnel Manifest */}
      <motion.div className={styles['crew-roster__panel']} data-panel="manifest" {...hudBoot}>
        <div className={styles['crew-roster__col-header']}>
          <span className={styles['crew-roster__col-label']}>◈ {stationCopy.crew.colList}</span>
          <span className={styles['crew-roster__count']}>{crew.length} crew</span>
        </div>

        <div
          className={styles['crew-roster__filters']}
          role="group"
          aria-label="Filter by status"
        >
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

        <motion.div
          className={styles['crew-roster__list']}
          variants={panelContainer}
          initial="initial"
          animate="animate"
        >
          {filteredCrew.map((member) => {
            const dotStatus = STATUS_DOT_CLASS[member.status] ?? 'offline';
            const isSelected = member.id === selectedCrewId;
            return (
              <motion.div
                key={member.id}
                className={`${styles['crew-roster__row']} ${isSelected ? styles['crew-roster__row--selected'] : ''}`}
                onClick={() => setSelectedCrewId(member.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedCrewId(member.id)}
                aria-pressed={isSelected}
                data-testid={`crew-row-${member.id}`}
                variants={panelItem}
              >
                <span
                  className={`${styles['crew-roster__dot']} ${styles[`crew-roster__dot--${dotStatus}`]}`}
                  aria-hidden="true"
                />
                <span className={styles['crew-roster__row-name']}>{member.name}</span>
                <span className={styles['crew-roster__row-role']}>{member.role}</span>
                <span
                  className={`${styles['crew-roster__row-status']} ${styles[`crew-roster__row-status--${member.status}`]}`}
                >
                  {member.status.toUpperCase()}
                </span>
              </motion.div>
            );
          })}
          {filteredCrew.length === 0 && (
            <p className={styles['crew-roster__empty']}>{stationCopy.crew.empty}</p>
          )}
        </motion.div>
      </motion.div>

      {/* Right panel — Personnel File */}
      <motion.div className={styles['crew-roster__panel']} data-panel="file" {...hudBoot}>
        <div className={styles['crew-roster__col-header']}>
          <span className={styles['crew-roster__col-label']}>◈ {stationCopy.crew.colDetail}</span>
        </div>

        {selectedMember === null ? (
          <div className={styles['crew-roster__empty-detail']}>
            <span className={styles['crew-roster__empty-detail-text']}>
              {stationCopy.crew.noSelection}
            </span>
          </div>
        ) : (
          <div className={styles['crew-roster__detail']}>
            <h2 className={styles['crew-roster__detail-name']}>{selectedMember.name}</h2>
            <span className={styles['crew-roster__detail-role']}>
              {selectedMember.role.toUpperCase()}
            </span>

            <div className={styles['crew-roster__detail-section']}>
              <span className={styles['crew-roster__detail-label']}>HEALTH</span>
              <CrewHealthBar health={selectedMember.health} />
            </div>

            <div className={styles['crew-roster__detail-section']}>
              <span className={styles['crew-roster__detail-label']}>ASSIGNED MODULE</span>
              <span className={styles['crew-roster__detail-value']}>
                {selectedMember.assignedModuleName ?? 'Unassigned'}
              </span>
            </div>

            <div className={styles['crew-roster__detail-section']}>
              <span className={styles['crew-roster__detail-label']}>STATUS</span>
              <span
                className={`${styles['crew-roster__detail-status']} ${styles[`crew-roster__detail-status--${selectedMember.status}`]}`}
              >
                {selectedMember.status.toUpperCase()}
              </span>
            </div>

            <div className={styles['crew-roster__detail-section']}>
              <span className={styles['crew-roster__detail-label']}>CHANGE ASSIGNMENT</span>
              <CrewAssignmentSelect
                crewId={selectedMember.id}
                assignedModuleId={selectedMember.assignedModuleId}
              />
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
