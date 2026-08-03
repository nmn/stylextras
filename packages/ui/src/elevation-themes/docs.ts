import * as stylex from '@stylexjs/stylex'
import { elevation } from '../tokens/elevation.stylex'
import type { ElevationTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

export const docsTheme: ElevationTheme = stylex.createTheme(elevation, {
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
