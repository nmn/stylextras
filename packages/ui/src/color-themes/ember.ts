import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

/** Warm terracotta-and-amber editorial theme with a parchment-like canvas. */
export const emberTheme: ColorTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(98.3% 0.01 65)', 'oklch(15% 0.014 40)'),
  fg: lightDark('oklch(19% 0.02 40)', 'oklch(95% 0.015 65)'),
  tone: lightDark('oklch(52% 0.03 45)', 'oklch(72% 0.028 60)'),
  brand: lightDark('oklch(55% 0.17 40)', 'oklch(78% 0.13 55)'),
  fgOnBrand: lightDark('oklch(99% 0.008 70)', 'oklch(16% 0.02 40)'),
})
