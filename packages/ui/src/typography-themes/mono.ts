import * as stylex from '@stylexjs/stylex'
import { typography } from '../tokens/typography.stylex'
import type { TypographyTheme } from './types'

export const monoTheme: TypographyTheme = stylex.createTheme(typography, {
  fontSizeMin: '0.8125rem',
  fontSizeMax: '0.875rem',
  scaleMin: '1.12',
  scaleMax: '1.16',
  fontSans: `"SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace`,
  fontDisplay: `"SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace`,
  fontMono: `"SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace`,
  lineHeightTight: '1.12',
  lineHeightSnug: '1.28',
  lineHeightBody: '1.48',
  trackingTight: '-0.01em',
  trackingNormal: '0em',
  trackingWide: '0.03em',
})
