import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const pinkTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(52.5% 0.223 3.96)'),
  tone: lightDark('oklch(59.2% 0.04 0.58)', 'oklch(71.8% 0.04 349.76)'),
  brand: lightDark('oklch(52.5% 0.223 3.96)', 'oklch(45.9% 0.187 3.82)'),
  fgOnBrand: lightDark('oklch(97.1% 0.014 343.2)', 'oklch(97.1% 0.014 343.2)'),
})
