import * as stylex from '@stylexjs/stylex'
import { elevation } from '../tokens/elevation.stylex'
import type { ElevationTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

export const posterTheme: ElevationTheme = stylex.createTheme(elevation, {
  shadowColor: lightDark('rgba(9, 9, 11, 0.36)', 'rgba(0, 0, 0, 0.8)'),
  offset: '3px',
  blur: '1px',
})
