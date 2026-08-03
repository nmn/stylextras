import * as stylex from '@stylexjs/stylex'
import { spacing } from '../tokens/spacing.stylex'
import type { SpacingTheme } from './types'

export const posterTheme: SpacingTheme = stylex.createTheme(spacing, {
  base: '6px',
})
