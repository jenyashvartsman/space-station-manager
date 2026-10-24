import { motion } from 'framer-motion';
import { CrewHealthBar } from '../CrewHealthBar/CrewHealthBar';
import { CrewAssignmentSelect } from '../CrewAssignmentSelect/CrewAssignmentSelect';
import type { CrewMember } from '../../types/crew.types';
import styles from './CrewCard.module.scss';

interface CrewCardProps {
  member: CrewMember;
}

const STATUS_DOT_CLASS: Record<string, string> = {
  active: styles['crew-card__status-dot--nominal'],
  resting: styles['crew-card__status-dot--offline'],
  injured: styles['crew-card__status-dot--critical'],
  eva: styles['crew-card__status-dot--warning'],
};

export const crewCardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function CrewCard({ member }: CrewCardProps) {
  const dotClass = STATUS_DOT_CLASS[member.status] ?? styles['crew-card__status-dot--offline'];

  return (
    <motion.div
      variants={crewCardVariants}
      className={styles['crew-card']}
      data-testid={`crew-card-${member.id}`}
    >
      <div className={styles['crew-card__header']}>
        <span className={`${styles['crew-card__status-dot']} ${dotClass}`} aria-hidden="true" />
        <span className={styles['crew-card__name']}>{member.name}</span>
      </div>

      <span className={styles['crew-card__role']}>{member.role.toUpperCase()}</span>

      <CrewHealthBar health={member.health} />

      <div className={styles['crew-card__assignment']}>
        <span className={styles['crew-card__assignment-label']}>
          Module: {member.assignedModuleName ?? 'Unassigned'}
        </span>
        <CrewAssignmentSelect
          crewId={member.id}
          assignedModuleId={member.assignedModuleId}
        />
      </div>
    </motion.div>
  );
}
