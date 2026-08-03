import * as stylex from '@stylexjs/stylex'
import { motion } from '../tokens/motion.stylex'
import type { MotionTheme } from './types'

export const docsTheme: MotionTheme = stylex.createTheme(motion, {
  durationBase: '150ms',
  durationInstant: '0ms',
  durationFast: '100ms',
  durationModerate: '150ms',
  durationSlow: '200ms',
  durationSlower: '300ms',
  easeStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeEmphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
})
