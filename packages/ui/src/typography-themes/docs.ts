import * as stylex from '@stylexjs/stylex'
import { typography } from '../tokens/typography.stylex'
import type { TypographyTheme } from './types'

export const docsTheme: TypographyTheme = stylex.createTheme(typography, {
  fontSizeMin: '0.875rem',
  fontSizeMax: '0.875rem',
  scaleMin: '1.125',
  scaleMax: '1.2',
  fontSans: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
  fontDisplay: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
  fontMono: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  lineHeightTight: '1.2',
  lineHeightSnug: '1.35',
  lineHeightBody: '1.5',
  trackingTight: '-0.015em',
  trackingNormal: '0em',
  trackingWide: '0.015em',
  weightRegular: '400',
  weightMedium: '500',
  weightSemibold: '600',
  weightBold: '700',
})
