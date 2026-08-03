import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const limeTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(84.1% 0.238 128.85)'),
  tone: lightDark('oklch(64.8% 0.035 131.68)', 'oklch(86.5% 0.04 128.4)'),
  brand: lightDark('oklch(84.1% 0.238 128.85)', 'oklch(76.8% 0.233 130.85)'),
  fgOnBrand: lightDark('oklch(40.5% 0.101 131.06)', 'oklch(40.5% 0.101 131.06)'),
})
