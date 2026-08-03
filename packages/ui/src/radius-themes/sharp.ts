import * as stylex from '@stylexjs/stylex'
import { radius } from '../tokens/radius.stylex'
import type { RadiusTheme } from './types'

export const sharpTheme: RadiusTheme = stylex.createTheme(radius, {
  base: '0px',
})
