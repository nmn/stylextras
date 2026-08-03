import * as stylex from '@stylexjs/stylex'
import { typography } from '../tokens/typography.stylex'
import type { TypographyTheme } from './types'

/** Small, tight type scale for data-dense dashboards and utility UI. */
export const compactTheme: TypographyTheme = stylex.createTheme(typography, {
  fontSizeMin: '0.75rem',
  fontSizeMax: '0.8125rem',
  scaleMin: '1.1',
  scaleMax: '1.14',
  lineHeightTight: '1.1',
  lineHeightSnug: '1.2',
  lineHeightBody: '1.35',
  trackingTight: '-0.01em',
  trackingNormal: '0em',
  trackingWide: '0.02em',
})
