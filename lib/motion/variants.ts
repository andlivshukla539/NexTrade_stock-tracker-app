export const fadeIn = (duration = 0.4, delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration, delay } },
});

export const slideUp = (distance = 12, duration = 0.5, delay = 0) => ({
  initial: { opacity: 0, y: distance },
  animate: { opacity: 1, y: 0, transition: { duration, delay } },
});

export const slideInView = (distance = 16, duration = 0.6, delay = 0) => ({
  initial: { opacity: 0, y: distance },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration, delay },
  },
  viewport: { once: true, amount: 0.2 },
});

export const staggerContainer = (stagger = 0.06, delayChildren = 0) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const itemFadeUp = (i = 0, distance = 8, duration = 0.35) => ({
  initial: { opacity: 0, y: distance },
  animate: { opacity: 1, y: 0, transition: { duration, delay: i * 0.04 } },
});
