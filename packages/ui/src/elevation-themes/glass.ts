import * as stylex from '@stylexjs/stylex'
import { elevation } from '../tokens/elevation.stylex'
import type { ElevationTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

/** Large, soft, diffused shadow suited to glassmorphism and blurred surfaces. */
export const glassTheme: ElevationTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark('rgba(9, 9, 11, 0.14)', 'rgba(0, 0, 0, 0.46)'),
  offset: '3px',
  blur: '10px',
})
