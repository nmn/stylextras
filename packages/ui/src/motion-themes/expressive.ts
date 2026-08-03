import * as stylex from '@stylexjs/stylex'
import { motion } from '../tokens/motion.stylex'
import type { MotionTheme } from './types'

export const expressiveTheme: MotionTheme = stylex.createTheme(motion, {
  durationBase: '180ms',
  easeStandard: 'cubic-bezier(0.3, 0, 0.2, 1)',
  easeEmphasized: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
})
