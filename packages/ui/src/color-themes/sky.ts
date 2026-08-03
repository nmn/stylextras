import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const skyTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(50% 0.134 242.75)'),
  tone: lightDark('oklch(58.8% 0.03 241.97)', 'oklch(74.6% 0.035 232.66)'),
  brand: lightDark('oklch(50% 0.134 242.75)', 'oklch(44.3% 0.11 240.79)'),
  fgOnBrand: lightDark('oklch(97.7% 0.013 236.62)', 'oklch(97.7% 0.013 236.62)'),
})
