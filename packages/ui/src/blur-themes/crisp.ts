import * as stylex from '@stylexjs/stylex'
import { blur } from '../tokens/blur.stylex'
import type { BlurTheme } from './types'

export const crispTheme: BlurTheme = stylex.createTheme(blur, {
  md: '0px',
})
