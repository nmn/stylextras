import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const blueTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(48.8% 0.243 264.38)'),
  tone: lightDark('oklch(54.6% 0.04 262.9)', 'oklch(70.7% 0.035 254.6)'),
  brand: lightDark('oklch(48.8% 0.243 264.38)', 'oklch(42.4% 0.199 265.64)'),
  fgOnBrand: lightDark('oklch(97% 0.014 254.6)', 'oklch(97% 0.014 254.6)'),
})
