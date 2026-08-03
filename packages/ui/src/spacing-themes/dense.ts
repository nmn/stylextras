import * as stylex from '@stylexjs/stylex'
import { spacing } from '../tokens/spacing.stylex'
import type { SpacingTheme } from './types'

/** High-density rhythm for data tables and information-dense dashboards. */
export const denseTheme: SpacingTheme = stylex.createTheme(spacing, {
  base: '2.5px',
})
