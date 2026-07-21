import * as stylex from '@stylexjs/stylex'
import { motion } from '../tokens/motion.stylex'

export const standardTheme = stylex.createTheme(motion, {})

export const docsTheme = stylex.createTheme(motion, {
  durationBase: '150ms',
  durationInstant: '0ms',
  durationFast: '100ms',
  durationModerate: '150ms',
  durationSlow: '200ms',
  durationSlower: '300ms',
  easeStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeEmphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
})

export const snappyTheme = stylex.createTheme(motion, {
  durationBase: '120ms',
  easeStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  easeEmphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
})

export const gentleTheme = stylex.createTheme(motion, {
  durationBase: '200ms',
  easeStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeEmphasized: 'cubic-bezier(0.22, 1, 0.36, 1)',
})

export const expressiveTheme = stylex.createTheme(motion, {
  durationBase: '180ms',
  easeStandard: 'cubic-bezier(0.3, 0, 0.2, 1)',
  easeEmphasized: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
})

export const instantTheme = stylex.createTheme(motion, {
  durationBase: '0ms',
})

/** Slow, silky motion for ambient, glass-like interfaces. */
export const fluidTheme = stylex.createTheme(motion, {
  durationBase: '260ms',
  easeStandard: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  easeEmphasized: 'cubic-bezier(0.19, 1, 0.22, 1)',
})

/** Extra-fast motion for dense, utility-first interfaces. */
export const briskTheme = stylex.createTheme(motion, {
  durationBase: '90ms',
  easeStandard: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeEmphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
})

export const motionThemes = {
  standard: standardTheme,
  docs: docsTheme,
  brisk: briskTheme,
  snappy: snappyTheme,
  gentle: gentleTheme,
  fluid: fluidTheme,
  expressive: expressiveTheme,
  instant: instantTheme,
} as const

export type MotionThemeName = keyof typeof motionThemes
