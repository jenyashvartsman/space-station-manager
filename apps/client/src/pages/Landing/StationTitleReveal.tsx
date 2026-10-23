import { motion } from 'framer-motion';
import styles from './Landing.module.scss';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.04,
    },
  },
};

const charVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

interface StationTitleRevealProps {
  title: string;
}

export function StationTitleReveal({ title }: StationTitleRevealProps) {
  return (
    <motion.h1
      className={styles['landing__title']}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={title}
    >
      {title.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={charVariants}
          className={char === ' ' ? styles['landing__title-space'] : undefined}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
