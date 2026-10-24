// Shared Framer Motion variants — Space Station Manager
// All per-page animation tasks import from here

export const pageEnter = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export const panelContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const panelItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

export const hoverLift = {
  whileHover: { y: -3, transition: { duration: 0.15 } },
};
