import * as stylex from '@stylexjs/stylex'
import { blur } from '../tokens/blur.stylex'

export const baseTheme = stylex.createTheme(blur, {})

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

export const blurThemes = {
  base: baseTheme,
  crisp: crispTheme,
  subtle: subtleTheme,
  soft: softTheme,
  hazy: hazyTheme,
} as const

export type BlurThemeName = keyof typeof blurThemes
