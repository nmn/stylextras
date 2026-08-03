import * as stylex from '@stylexjs/stylex'
import { blur } from '../tokens/blur.stylex'
import type { BlurTheme } from './types'

/** Heavy frosted-glass blur for prominent glassmorphism overlays. */
export const frostedTheme: BlurTheme = stylex.createTheme(blur, {
  md: '20px',
})
