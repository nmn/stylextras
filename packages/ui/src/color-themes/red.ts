import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const redTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(50.5% 0.213 27.52)'),
  tone: lightDark('oklch(57.7% 0.04 27.33)', 'oklch(70.4% 0.04 22.22)'),
  brand: lightDark('oklch(50.5% 0.213 27.52)', 'oklch(44.4% 0.177 26.9)'),
  fgOnBrand: lightDark('oklch(97.1% 0.013 17.38)', 'oklch(97.1% 0.013 17.38)'),
})
