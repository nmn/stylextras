import * as stylex from '@stylexjs/stylex'
import { blur } from '../tokens/blur.stylex'

export type BlurTheme = stylex.Theme<typeof blur>

export const baseTheme: BlurTheme = stylex.createTheme(blur, {})

export const docsTheme: BlurTheme = stylex.createTheme(blur, {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '32px',
  xl: '48px',
})

export const crispTheme: BlurTheme = stylex.createTheme(blur, {
  md: '0px',
})

export const subtleTheme: BlurTheme = stylex.createTheme(blur, {
  md: '2px',
})

export const softTheme: BlurTheme = stylex.createTheme(blur, {
  md: '4px',
})

export const hazyTheme: BlurTheme = stylex.createTheme(blur, {
  md: '8px',
})

/** The faintest hint of blur, just short of fully crisp. */
export const gauzeTheme: BlurTheme = stylex.createTheme(blur, {
  md: '1px',
})

/** Heavy frosted-glass blur for prominent glassmorphism overlays. */
export const frostedTheme: BlurTheme = stylex.createTheme(blur, {
  md: '20px',
})

export const blurThemes: Readonly<{
  base: BlurTheme
  docs: BlurTheme
  crisp: BlurTheme
  gauze: BlurTheme
  subtle: BlurTheme
  soft: BlurTheme
  hazy: BlurTheme
  frosted: BlurTheme
}> = {
  base: baseTheme,
  docs: docsTheme,
  crisp: crispTheme,
  gauze: gauzeTheme,
  subtle: subtleTheme,
  soft: softTheme,
  hazy: hazyTheme,
  frosted: frostedTheme,
}

export type BlurThemeName = keyof typeof blurThemes
