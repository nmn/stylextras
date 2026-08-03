import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const indigoTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(45.7% 0.24 277.02)'),
  tone: lightDark('oklch(51.1% 0.04 276.97)', 'oklch(68.5% 0.035 277.73)'),
  brand: lightDark('oklch(45.7% 0.24 277.02)', 'oklch(39.8% 0.195 277.37)'),
  fgOnBrand: lightDark('oklch(96.2% 0.018 272.31)', 'oklch(96.2% 0.018 272.31)'),
})
