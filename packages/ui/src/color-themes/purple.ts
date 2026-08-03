import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const purpleTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(49.6% 0.265 301.92)'),
  tone: lightDark('oklch(55.8% 0.045 302.32)', 'oklch(71.4% 0.04 305.5)'),
  brand: lightDark('oklch(49.6% 0.265 301.92)', 'oklch(43.8% 0.218 303.72)'),
  fgOnBrand: lightDark('oklch(97.7% 0.014 308.3)', 'oklch(97.7% 0.014 308.3)'),
})
