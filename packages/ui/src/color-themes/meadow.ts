import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

/** Fresh botanical green theme with a light, airy canvas. */
export const meadowTheme: ColorTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(99% 0.006 140)', 'oklch(14% 0.016 155)'),
  fg: lightDark('oklch(17% 0.02 155)', 'oklch(96% 0.012 140)'),
  tone: lightDark('oklch(51% 0.03 150)', 'oklch(72% 0.025 145)'),
  brand: lightDark('oklch(50% 0.135 152)', 'oklch(78% 0.14 150)'),
  fgOnBrand: lightDark('oklch(99% 0.006 140)', 'oklch(16% 0.02 155)'),
})
