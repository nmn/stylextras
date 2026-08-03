import * as stylex from '@stylexjs/stylex'
import { radius } from '../tokens/radius.stylex'
import type { RadiusTheme } from './types'

/** Plush, toy-like corners for expressive and playful surfaces. */
export const plushTheme: RadiusTheme = stylex.createTheme(radius, {
  base: '24px',
})
