import * as stylex from '@stylexjs/stylex'
import { motion } from '../tokens/motion.stylex'
import type { MotionTheme } from './types'

export const gentleTheme: MotionTheme = stylex.createTheme(motion, {
  durationBase: '200ms',
  easeStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeEmphasized: 'cubic-bezier(0.22, 1, 0.36, 1)',
})
