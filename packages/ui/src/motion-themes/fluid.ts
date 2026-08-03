import * as stylex from '@stylexjs/stylex'
import { motion } from '../tokens/motion.stylex'
import type { MotionTheme } from './types'

/** Slow, silky motion for ambient, glass-like interfaces. */
export const fluidTheme: MotionTheme = stylex.createTheme(motion, {
  durationBase: '260ms',
  easeStandard: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  easeEmphasized: 'cubic-bezier(0.19, 1, 0.22, 1)',
})
