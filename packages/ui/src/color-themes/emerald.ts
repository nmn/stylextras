import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const emeraldTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(50.8% 0.118 165.61)'),
  tone: lightDark('oklch(59.6% 0.03 163.23)', 'oklch(76.5% 0.035 163.22)'),
  brand: lightDark('oklch(50.8% 0.118 165.61)', 'oklch(43.2% 0.095 166.91)'),
  fgOnBrand: lightDark('oklch(97.9% 0.021 166.11)', 'oklch(97.9% 0.021 166.11)'),
})
