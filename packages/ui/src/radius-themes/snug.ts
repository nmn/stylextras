import * as stylex from '@stylexjs/stylex'
import { radius } from '../tokens/radius.stylex'
import type { RadiusTheme } from './types'

/** Tighter corners than subtle, for dense utility UIs. */
export const snugTheme: RadiusTheme = stylex.createTheme(radius, {
  base: '4px',
})
