import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const violetTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(49.1% 0.27 292.58)'),
  tone: lightDark('oklch(54.1% 0.045 293.01)', 'oklch(70.2% 0.04 293.54)'),
  brand: lightDark('oklch(49.1% 0.27 292.58)', 'oklch(43.2% 0.232 292.76)'),
  fgOnBrand: lightDark('oklch(96.9% 0.016 293.76)', 'oklch(96.9% 0.016 293.76)'),
})
