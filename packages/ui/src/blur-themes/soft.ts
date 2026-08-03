import * as stylex from '@stylexjs/stylex'
import { blur } from '../tokens/blur.stylex'
import type { BlurTheme } from './types'

export const softTheme: BlurTheme = stylex.createTheme(blur, {
  md: '4px',
})
