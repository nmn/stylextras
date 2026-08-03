import * as stylex from '@stylexjs/stylex'
import { spacing } from '../tokens/spacing.stylex'
import type { SpacingTheme } from './types'

export const baseTheme: SpacingTheme = stylex.createTheme(spacing, {})
