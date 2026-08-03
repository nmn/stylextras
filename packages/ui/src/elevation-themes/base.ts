import * as stylex from '@stylexjs/stylex'
import { elevation } from '../tokens/elevation.stylex'
import type { ElevationTheme } from './types'

export const baseTheme: ElevationTheme = stylex.createTheme(elevation, {})
