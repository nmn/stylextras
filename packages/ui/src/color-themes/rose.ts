import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const roseTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(51.4% 0.222 16.94)'),
  tone: lightDark('oklch(58.6% 0.04 17.59)', 'oklch(71.2% 0.04 13.43)'),
  brand: lightDark('oklch(51.4% 0.222 16.94)', 'oklch(45.5% 0.188 13.7)'),
  fgOnBrand: lightDark('oklch(96.9% 0.015 12.42)', 'oklch(96.9% 0.015 12.42)'),
})
