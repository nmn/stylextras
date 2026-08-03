import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

/** Airy blue-gray neutrals. */
export const mistTheme: ColorTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(100% 0 0)', 'oklch(14.8% 0.004 228.8)'),
  fg: lightDark('oklch(14.8% 0.004 228.8)', 'oklch(98.7% 0.002 197.1)'),
  tone: lightDark('oklch(56% 0.021 213.5)', 'oklch(72.3% 0.014 214.4)'),
  brand: lightDark('oklch(21.8% 0.008 223.9)', 'oklch(92.5% 0.005 214.3)'),
  fgOnBrand: lightDark('oklch(98.7% 0.002 197.1)', 'oklch(21.8% 0.008 223.9)'),
})
