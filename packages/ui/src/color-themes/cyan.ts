import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const cyanTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(52% 0.105 223.13)'),
  tone: lightDark('oklch(60.9% 0.03 221.72)', 'oklch(78.9% 0.035 211.53)'),
  brand: lightDark('oklch(52% 0.105 223.13)', 'oklch(45% 0.085 224.28)'),
  fgOnBrand: lightDark('oklch(98.4% 0.019 200.87)', 'oklch(98.4% 0.019 200.87)'),
})
