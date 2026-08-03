import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

/** Plum-leaning neutral surfaces. */
export const mauveTheme: ColorTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(100% 0 0)', 'oklch(14.5% 0.008 326)'),
  fg: lightDark('oklch(14.5% 0.008 326)', 'oklch(98.5% 0 0)'),
  tone: lightDark('oklch(54.2% 0.034 322.5)', 'oklch(71.1% 0.019 323.02)'),
  brand: lightDark('oklch(21.2% 0.019 322.12)', 'oklch(92.2% 0.005 325.62)'),
  fgOnBrand: lightDark('oklch(98.5% 0 0)', 'oklch(21.2% 0.019 322.12)'),
})
