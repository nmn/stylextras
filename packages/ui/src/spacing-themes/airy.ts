import * as stylex from '@stylexjs/stylex'
import { spacing } from '../tokens/spacing.stylex'
import type { SpacingTheme } from './types'

/** Extra generous whitespace for marketing pages and hero sections. */
export const airyTheme: SpacingTheme = stylex.createTheme(spacing, {
  base: '7px',
})
