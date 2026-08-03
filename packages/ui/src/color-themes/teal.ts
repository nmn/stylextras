import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const tealTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(51.1% 0.096 186.39)'),
  tone: lightDark('oklch(60% 0.025 184.7)', 'oklch(77.7% 0.03 181.91)'),
  brand: lightDark('oklch(51.1% 0.096 186.39)', 'oklch(43.7% 0.078 188.22)'),
  fgOnBrand: lightDark('oklch(98.4% 0.014 180.72)', 'oklch(98.4% 0.014 180.72)'),
})
