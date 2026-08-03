import * as stylex from '@stylexjs/stylex'
import { typography } from '../tokens/typography.stylex'
import type { TypographyTheme } from './types'

/** Rounded, friendly type for consumer and wellness products. */
export const humanistTheme: TypographyTheme = stylex.createTheme(typography, {
  fontSizeMin: '0.875rem',
  fontSizeMax: '0.9375rem',
  scaleMin: '1.15',
  scaleMax: '1.22',
  fontSans: `"Quicksand", "Comfortaa", "Nunito", ui-sans-serif, system-ui, sans-serif`,
  fontDisplay: `"Quicksand", "Comfortaa", "Nunito", ui-sans-serif, system-ui, sans-serif`,
  lineHeightTight: '1.25',
  lineHeightSnug: '1.4',
  lineHeightBody: '1.6',
  trackingTight: '-0.005em',
  trackingNormal: '0.005em',
  trackingWide: '0.02em',
})
