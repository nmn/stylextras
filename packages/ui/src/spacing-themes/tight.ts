import * as stylex from '@stylexjs/stylex'
import { spacing } from '../tokens/spacing.stylex'
import type { SpacingTheme } from './types'

export const tightTheme: SpacingTheme = stylex.createTheme(spacing, {
  base: '3px',
})
