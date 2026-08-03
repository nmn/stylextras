import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const greenTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(52.7% 0.154 150.07)'),
  tone: lightDark('oklch(62.7% 0.035 149.21)', 'oklch(79.2% 0.04 151.71)'),
  brand: lightDark('oklch(52.7% 0.154 150.07)', 'oklch(44.8% 0.119 151.33)'),
  fgOnBrand: lightDark('oklch(98.2% 0.018 155.83)', 'oklch(98.2% 0.018 155.83)'),
})
