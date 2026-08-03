import * as stylex from '@stylexjs/stylex'
import { elevation } from '../tokens/elevation.stylex'
import type { ElevationTheme } from './types'

export const flatTheme: ElevationTheme = stylex.createTheme(elevation, {
  shadowColor: 'transparent',
  offset: '0px',
  blur: '0px',
})
