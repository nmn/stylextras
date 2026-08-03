import * as stylex from '@stylexjs/stylex'
import { spacing } from '../tokens/spacing.stylex'
import type { SpacingTheme } from './types'

export const roomyTheme: SpacingTheme = stylex.createTheme(spacing, {
  base: '5px',
})
