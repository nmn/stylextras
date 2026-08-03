import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const amberTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(55.5% 0.163 49)'),
  tone: lightDark('oklch(66.6% 0.035 58.3)', 'oklch(79.5% 0.04 86.1)'),
  brand: lightDark('oklch(55.5% 0.163 49)', 'oklch(47.3% 0.137 46.2)'),
  fgOnBrand: lightDark('oklch(98.7% 0.022 95.3)', 'oklch(98.7% 0.022 95.3)'),
})
