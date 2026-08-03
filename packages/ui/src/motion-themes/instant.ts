import * as stylex from '@stylexjs/stylex'
import { motion } from '../tokens/motion.stylex'
import type { MotionTheme } from './types'

export const instantTheme: MotionTheme = stylex.createTheme(motion, {
  durationBase: '0ms',
})
