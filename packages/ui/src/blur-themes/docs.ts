import * as stylex from '@stylexjs/stylex'
import { blur } from '../tokens/blur.stylex'
import type { BlurTheme } from './types'

export const docsTheme: BlurTheme = stylex.createTheme(blur, {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '32px',
  xl: '48px',
})
