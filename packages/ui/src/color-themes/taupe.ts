import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

/** Earthy brown-gray neutrals. */
export const taupeTheme: ColorTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(100% 0 0)', 'oklch(14.8% 0.004 49.3)'),
  fg: lightDark('oklch(14.8% 0.004 49.3)', 'oklch(98.6% 0.002 67.8)'),
  tone: lightDark('oklch(55.6% 0.014 58.1)', 'oklch(71% 0.012 56.3)'),
  brand: lightDark('oklch(21.4% 0.009 43.1)', 'oklch(92.2% 0.005 34.3)'),
  fgOnBrand: lightDark('oklch(98.6% 0.002 67.8)', 'oklch(21.4% 0.009 43.1)'),
})
