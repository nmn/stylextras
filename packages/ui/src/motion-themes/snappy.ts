import * as stylex from '@stylexjs/stylex'
import { motion } from '../tokens/motion.stylex'
import type { MotionTheme } from './types'

export const snappyTheme: MotionTheme = stylex.createTheme(motion, {
  durationBase: '120ms',
  easeStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  easeEmphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
})
