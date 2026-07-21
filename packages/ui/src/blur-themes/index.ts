import * as stylex from '@stylexjs/stylex'
import { blur } from '../tokens/blur.stylex'

export const baseTheme = stylex.createTheme(blur, {})

export const docsTheme = stylex.createTheme(blur, {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '32px',
  xl: '48px',
})

export const crispTheme = stylex.createTheme(blur, {
  md: '0px',
})

export const subtleTheme = stylex.createTheme(blur, {
  md: '2px',
})

export const softTheme = stylex.createTheme(blur, {
  md: '4px',
})

export const hazyTheme = stylex.createTheme(blur, {
  md: '8px',
})

/** The faintest hint of blur, just short of fully crisp. */
export const gauzeTheme = stylex.createTheme(blur, {
  md: '1px',
})

/** Heavy frosted-glass blur for prominent glassmorphism overlays. */
export const frostedTheme = stylex.createTheme(blur, {
  md: '20px',
})

export const blurThemes = {
  base: baseTheme,
  docs: docsTheme,
  crisp: crispTheme,
  gauze: gauzeTheme,
  subtle: subtleTheme,
  soft: softTheme,
  hazy: hazyTheme,
  frosted: frostedTheme,
} as const

export type BlurThemeName = keyof typeof blurThemes
