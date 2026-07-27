import * as stylex from '@stylexjs/stylex'
import { spacing } from '../tokens/spacing.stylex'

export type SpacingTheme = stylex.Theme<typeof spacing>

export const baseTheme: SpacingTheme = stylex.createTheme(spacing, {})

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

export const tightTheme: SpacingTheme = stylex.createTheme(spacing, {
  base: '3px',
})
export const microTheme: SpacingTheme = tightTheme

export const compactTheme: SpacingTheme = stylex.createTheme(spacing, {
  base: '3.5px',
})

export const cozyTheme: SpacingTheme = stylex.createTheme(spacing, {
  base: '4.5px',
})

export const roomyTheme: SpacingTheme = stylex.createTheme(spacing, {
  base: '5px',
})

export const posterTheme: SpacingTheme = stylex.createTheme(spacing, {
  base: '6px',
})

/** Extra generous whitespace for marketing pages and hero sections. */
export const airyTheme: SpacingTheme = stylex.createTheme(spacing, {
  base: '7px',
})

/** High-density rhythm for data tables and information-dense dashboards. */
export const denseTheme: SpacingTheme = stylex.createTheme(spacing, {
  base: '2.5px',
})

export const spacingThemes: Readonly<{
  base: SpacingTheme
  docs: SpacingTheme
  dense: SpacingTheme
  tight: SpacingTheme
  compact: SpacingTheme
  cozy: SpacingTheme
  roomy: SpacingTheme
  poster: SpacingTheme
  airy: SpacingTheme
}> = {
  base: baseTheme,
  docs: docsTheme,
  dense: denseTheme,
  tight: tightTheme,
  compact: compactTheme,
  cozy: cozyTheme,
  roomy: roomyTheme,
  poster: posterTheme,
  airy: airyTheme,
}

export type SpacingThemeName = keyof typeof spacingThemes
