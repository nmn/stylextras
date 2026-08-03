import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const yellowTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(85.2% 0.199 91.94)'),
  tone: lightDark('oklch(68.1% 0.035 75.83)', 'oklch(85.2% 0.04 91.94)'),
  brand: lightDark('oklch(85.2% 0.199 91.94)', 'oklch(79.5% 0.184 86.05)'),
  fgOnBrand: lightDark('oklch(42.1% 0.095 57.71)', 'oklch(42.1% 0.095 57.71)'),
})
