import * as stylex from '@stylexjs/stylex'
import { elevation } from '../tokens/elevation.stylex'
import type { ElevationTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

/** Barely-there micro shadow for near-flat, minimal interfaces. */
export const whisperTheme: ElevationTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark('rgba(9, 9, 11, 0.08)', 'rgba(0, 0, 0, 0.3)'),
  offset: '0.5px',
  blur: '1.5px',
})
