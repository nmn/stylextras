import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const orangeTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(55.3% 0.195 38.4)'),
  tone: lightDark('oklch(64.6% 0.04 41.12)', 'oklch(75% 0.035 55.93)'),
  brand: lightDark('oklch(55.3% 0.195 38.4)', 'oklch(47% 0.157 37.3)'),
  fgOnBrand: lightDark('oklch(98% 0.016 73.68)', 'oklch(98% 0.016 73.68)'),
})
