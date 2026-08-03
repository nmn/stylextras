import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

/** Cool graphite neutrals. */
export const zincTheme: ColorTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(100% 0 0)', 'oklch(14.1% 0.005 285.82)'),
  fg: lightDark('oklch(14.1% 0.005 285.82)', 'oklch(98.5% 0 0)'),
  tone: lightDark('oklch(55.2% 0.016 285.94)', 'oklch(70.5% 0.015 286.07)'),
  brand: lightDark('oklch(21% 0.006 285.89)', 'oklch(92% 0.004 286.32)'),
  fgOnBrand: lightDark('oklch(98.5% 0 0)', 'oklch(21% 0.006 285.89)'),
})
