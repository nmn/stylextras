import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

const accentBackground = (accent: string) =>
  lightDark(`color-mix(in oklab, oklch(100% 0 0) 97%, ${accent})`, 'oklch(14.5% 0 0)')

export const fuchsiaTheme: ColorTheme = stylex.createTheme(colors, {
  bg: accentBackground('oklch(51.8% 0.253 323.95)'),
  tone: lightDark('oklch(59.1% 0.045 322.9)', 'oklch(74% 0.04 322.16)'),
  brand: lightDark('oklch(51.8% 0.253 323.95)', 'oklch(45.2% 0.211 324.59)'),
  fgOnBrand: lightDark('oklch(97.7% 0.017 320.06)', 'oklch(97.7% 0.017 320.06)'),
})
