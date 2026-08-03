import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

/** Botanical gray-green neutrals. */
export const oliveTheme: ColorTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(100% 0 0)', 'oklch(15.3% 0.006 107.1)'),
  fg: lightDark('oklch(15.3% 0.006 107.1)', 'oklch(98.8% 0.003 106.5)'),
  tone: lightDark('oklch(58% 0.031 107.3)', 'oklch(73.7% 0.021 106.9)'),
  brand: lightDark('oklch(22.8% 0.013 107.4)', 'oklch(93% 0.007 106.5)'),
  fgOnBrand: lightDark('oklch(98.8% 0.003 106.5)', 'oklch(22.8% 0.013 107.4)'),
})
