import * as stylex from '@stylexjs/stylex'
import { spacing } from '../tokens/spacing.stylex'

export const baseTheme = stylex.createTheme(spacing, {})

export const docsTheme = stylex.createTheme(spacing, {
  base: '4px',
  controlGap: '8px',
  controlSm: '32px',
  controlMd: '36px',
  controlLg: '40px',
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

export const tightTheme = stylex.createTheme(spacing, {
  base: '3px',
})
export const microTheme = tightTheme

export const compactTheme = stylex.createTheme(spacing, {
  base: '3.5px',
})

export const cozyTheme = stylex.createTheme(spacing, {
  base: '4.5px',
})

export const roomyTheme = stylex.createTheme(spacing, {
  base: '5px',
})

export const posterTheme = stylex.createTheme(spacing, {
  base: '6px',
})

/** Extra generous whitespace for marketing pages and hero sections. */
export const airyTheme = stylex.createTheme(spacing, {
  base: '7px',
})

/** High-density rhythm for data tables and information-dense dashboards. */
export const denseTheme = stylex.createTheme(spacing, {
  base: '2.5px',
})

export const spacingThemes = {
  base: baseTheme,
  docs: docsTheme,
  dense: denseTheme,
  tight: tightTheme,
  compact: compactTheme,
  cozy: cozyTheme,
  roomy: roomyTheme,
  poster: posterTheme,
  airy: airyTheme,
} as const

export type SpacingThemeName = keyof typeof spacingThemes
