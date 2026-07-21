import * as stylex from '@stylexjs/stylex'
import { elevation } from '../tokens/elevation.stylex'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

export const baseTheme = stylex.createTheme(elevation, {})

export const docsTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark('rgba(0, 0, 0, 0.12)', 'rgba(0, 0, 0, 0.56)'),
  offset: '1px',
  blur: '3px',
  xs: lightDark('0 1px 2px 0 rgb(0 0 0 / 0.05)', '0 1px 2px 0 rgb(0 0 0 / 0.28)'),
  sm: lightDark(
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 1px 3px 0 rgb(0 0 0 / 0.42), 0 1px 2px -1px rgb(0 0 0 / 0.36)',
  ),
  md: lightDark('0 4px 16px rgba(0, 0, 0, 0.06)', '0 8px 24px rgba(0, 0, 0, 0.36)'),
  lg: lightDark(
    '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '0 16px 36px -8px rgba(0, 0, 0, 0.62), 0 8px 14px -8px rgba(0, 0, 0, 0.52)',
  ),
  xl: lightDark('0 25px 50px -12px rgba(0, 0, 0, 0.25)', '0 25px 50px -12px rgba(0, 0, 0, 0.72)'),
})

export const flatTheme = stylex.createTheme(elevation, {
  shadowColor: 'transparent',
  offset: '0px',
  blur: '0px',
})

export const softTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark('rgba(9, 9, 11, 0.12)', 'rgba(0, 0, 0, 0.4)'),
  offset: '1px',
  blur: '4px',
})

export const floatTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark('rgba(9, 9, 11, 0.16)', 'rgba(0, 0, 0, 0.52)'),
  offset: '2px',
  blur: '5px',
})

export const hardTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark('rgba(9, 9, 11, 0.28)', 'rgba(0, 0, 0, 0.72)'),
  offset: '2px',
  blur: '2px',
})

export const posterTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark('rgba(9, 9, 11, 0.36)', 'rgba(0, 0, 0, 0.8)'),
  offset: '3px',
  blur: '1px',
})

/** Barely-there micro shadow for near-flat, minimal interfaces. */
export const whisperTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark('rgba(9, 9, 11, 0.08)', 'rgba(0, 0, 0, 0.3)'),
  offset: '0.5px',
  blur: '1.5px',
})

/** Large, soft, diffused shadow suited to glassmorphism and blurred surfaces. */
export const glassTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark('rgba(9, 9, 11, 0.14)', 'rgba(0, 0, 0, 0.46)'),
  offset: '3px',
  blur: '10px',
})

export const elevationThemes = {
  base: baseTheme,
  docs: docsTheme,
  flat: flatTheme,
  whisper: whisperTheme,
  soft: softTheme,
  float: floatTheme,
  glass: glassTheme,
  hard: hardTheme,
  poster: posterTheme,
} as const

export type ElevationThemeName = keyof typeof elevationThemes
