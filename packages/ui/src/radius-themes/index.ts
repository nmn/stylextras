import * as stylex from '@stylexjs/stylex'
import { radius } from '../tokens/radius.stylex'

export const baseTheme = stylex.createTheme(radius, {})

export const docsTheme = stylex.createTheme(radius, {
  base: '8px',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  xxl: '20px',
  round: '9999px',
})

export const sharpTheme = stylex.createTheme(radius, {
  base: '0px',
})

export const roundedTheme = stylex.createTheme(radius, {
  base: '10px',
})

export const subtleTheme = stylex.createTheme(radius, {
  base: '6px',
})

export const softTheme = stylex.createTheme(radius, {
  base: '14px',
})

export const pillTheme = stylex.createTheme(radius, {
  base: '20px',
})

/** Tighter corners than subtle, for dense utility UIs. */
export const snugTheme = stylex.createTheme(radius, {
  base: '4px',
})

/** Plush, toy-like corners for expressive and playful surfaces. */
export const plushTheme = stylex.createTheme(radius, {
  base: '24px',
})

export const radiusThemes = {
  base: baseTheme,
  docs: docsTheme,
  sharp: sharpTheme,
  snug: snugTheme,
  subtle: subtleTheme,
  rounded: roundedTheme,
  soft: softTheme,
  pill: pillTheme,
  plush: plushTheme,
} as const

export type RadiusThemeName = keyof typeof radiusThemes
