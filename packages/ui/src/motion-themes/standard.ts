import * as stylex from '@stylexjs/stylex'
import { motion } from '../tokens/motion.stylex'
import type { MotionTheme } from './types'

export const standardTheme: MotionTheme = stylex.createTheme(motion, {})
