import * as stylex from '@stylexjs/stylex'
import { elevation } from '../tokens/elevation.stylex'
import type { ElevationTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

export const hardTheme: ElevationTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark('rgba(9, 9, 11, 0.28)', 'rgba(0, 0, 0, 0.72)'),
  offset: '2px',
  blur: '2px',
})
