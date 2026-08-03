import * as stylex from '@stylexjs/stylex'
import { colors } from '../tokens/color.stylex'
import type { ColorTheme } from './types'

const lightDark = (light: string, dark: string) => `light-dark(${light}, ${dark})`

/** Cool violet-teal glass theme with a nocturnal, aurora-lit accent system. */
export const auroraTheme: ColorTheme = stylex.createTheme(colors, {
  bg: lightDark('oklch(99% 0.004 240)', 'oklch(13% 0.025 262)'),
  fg: lightDark('oklch(16% 0.02 262)', 'oklch(96% 0.01 240)'),
  tone: lightDark('oklch(50% 0.035 255)', 'oklch(74% 0.03 240)'),
  brand: lightDark('oklch(52% 0.19 278)', 'oklch(78% 0.13 278)'),
  fgOnBrand: lightDark('oklch(99% 0 0)', 'oklch(15% 0.03 275)'),
})
