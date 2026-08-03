import * as stylex from '@stylexjs/stylex'
import { typography } from '../tokens/typography.stylex'
import type { TypographyTheme } from './types'

export const industrialTheme: TypographyTheme = stylex.createTheme(typography, {
  fontSizeMin: '0.875rem',
  fontSizeMax: '0.9375rem',
  scaleMin: '1.14',
  scaleMax: '1.2',
  fontSans: `"DIN Alternate", "Avenir Next Condensed", "Helvetica Neue", sans-serif`,
  fontDisplay: `"DIN Alternate", "Avenir Next Condensed", "Helvetica Neue", sans-serif`,
  lineHeightTight: '1.05',
  lineHeightSnug: '1.18',
  lineHeightBody: '1.42',
  trackingTight: '-0.04em',
  trackingNormal: '-0.015em',
  trackingWide: '0.04em',
  weightMedium: '600',
  weightSemibold: '700',
  weightBold: '800',
})
