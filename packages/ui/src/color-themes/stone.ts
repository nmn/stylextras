import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

/** Warm mineral neutrals. */
export const stoneTheme: ColorTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(100% 0 0)', 'oklch(14.7% 0.004 49.25)'),
  fg: lightDark('oklch(14.7% 0.004 49.25)', 'oklch(98.5% 0.001 106.42)'),
  tone: lightDark('oklch(55.3% 0.013 58.07)', 'oklch(70.9% 0.01 56.26)'),
  brand: lightDark('oklch(21.6% 0.006 56.04)', 'oklch(92.3% 0.003 48.72)'),
  fgOnBrand: lightDark('oklch(98.5% 0.001 106.42)', 'oklch(21.6% 0.006 56.04)'),
})
