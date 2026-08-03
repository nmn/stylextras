import * as stylex from '@stylexjs/stylex'
import { motion } from '../tokens/motion.stylex'
import type { MotionTheme } from './types'

/** Extra-fast motion for dense, utility-first interfaces. */
export const briskTheme: MotionTheme = stylex.createTheme(motion, {
  durationBase: '90ms',
  easeStandard: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeEmphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
})
