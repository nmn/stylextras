import * as stylex from '@stylexjs/stylex'
import { typography } from '../tokens/typography.stylex'
import type { TypographyTheme } from './types'

export const editorialTheme: TypographyTheme = stylex.createTheme(typography, {
  fontSizeMin: '0.9375rem',
  fontSizeMax: '1rem',
  scaleMin: '1.15',
  scaleMax: '1.2',
  fontSans: `"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif`,
  fontDisplay: `"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif`,
  lineHeightTight: '1.1',
  lineHeightSnug: '1.28',
  lineHeightBody: '1.62',
  trackingTight: '-0.03em',
  trackingNormal: '-0.01em',
  trackingWide: '0.01em',
})
