import * as stylex from '@stylexjs/stylex'
import { radius } from '../tokens/radius.stylex'

export type RadiusTheme = stylex.Theme<typeof radius>

export const baseTheme: RadiusTheme = stylex.createTheme(radius, {})

export const docsTheme: RadiusTheme = stylex.createTheme(radius, {
  base: '8px',
  xs: '4px',
  sm: '8px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  xxl: '20px',
  round: '9999px',
})

export const sharpTheme: RadiusTheme = stylex.createTheme(radius, {
  base: '0px',
})

export const roundedTheme: RadiusTheme = stylex.createTheme(radius, {
  base: '10px',
})

export const subtleTheme: RadiusTheme = stylex.createTheme(radius, {
  base: '6px',
})

export const softTheme: RadiusTheme = stylex.createTheme(radius, {
  base: '14px',
})

export const pillTheme: RadiusTheme = stylex.createTheme(radius, {
  base: '20px',
})

/** Tighter corners than subtle, for dense utility UIs. */
export const snugTheme: RadiusTheme = stylex.createTheme(radius, {
  base: '4px',
})

/** Plush, toy-like corners for expressive and playful surfaces. */
export const plushTheme: RadiusTheme = stylex.createTheme(radius, {
  base: '24px',
})

export const radiusThemes: Readonly<{
  base: RadiusTheme
  docs: RadiusTheme
  sharp: RadiusTheme
  snug: RadiusTheme
  subtle: RadiusTheme
  rounded: RadiusTheme
  soft: RadiusTheme
  pill: RadiusTheme
  plush: RadiusTheme
}> = {
  base: baseTheme,
  docs: docsTheme,
  sharp: sharpTheme,
  snug: snugTheme,
  subtle: subtleTheme,
  rounded: roundedTheme,
  soft: softTheme,
  pill: pillTheme,
  plush: plushTheme,
}

export type RadiusThemeName = keyof typeof radiusThemes
