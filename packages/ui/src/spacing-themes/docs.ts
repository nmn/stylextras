import * as stylex from '@stylexjs/stylex'
import { spacing } from '../tokens/spacing.stylex'
import type { SpacingTheme } from './types'

export const docsTheme: SpacingTheme = stylex.createTheme(spacing, {
  base: '4px',
  controlGap: '8px',
  controlSm: '28px',
  controlMd: '36px',
  controlLg: '40px',
  targetMin: '24px',
  targetCoarse: '44px',
  xxxs: '2px',
  xxs: '4px',
  xs: '6px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px',
  xxxxl: '64px',
})
