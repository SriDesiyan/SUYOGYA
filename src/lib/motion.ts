import type { Transition, Variants } from 'framer-motion'

/**
 * SUYOGYA motion library — a small set of physically-tuned springs and
 * reusable variants so animation feels consistent across the product.
 */

export const spring = {
  soft: { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 } as Transition,
  snappy: { type: 'spring', stiffness: 420, damping: 34 } as Transition,
  gentle: { type: 'spring', stiffness: 140, damping: 22 } as Transition,
  bouncy: { type: 'spring', stiffness: 380, damping: 18, mass: 0.8 } as Transition,
} as const

export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOutPower: [0.65, 0, 0.35, 1] as [number, number, number, number],
  springSoft: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
}

/** Fade + rise — the default entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.outExpo } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: ease.outExpo } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: ease.outExpo } },
}

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 10 },
  show: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 0.7, ease: ease.outExpo },
  },
}

/** Container that staggers its children. */
export function staggerContainer(stagger = 0.08, delayChildren = 0.05): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  }
}

/** Standard viewport config for scroll-in reveals. */
export const inViewport = { once: true, amount: 0.3, margin: '0px 0px -10% 0px' } as const

/** Shared hover/tap lift used on interactive cards. */
export const hoverLift = {
  whileHover: { y: -4, transition: spring.soft },
  whileTap: { scale: 0.985 },
}

/** Page transition for route changes. */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.outExpo } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: ease.inOutPower } },
}
