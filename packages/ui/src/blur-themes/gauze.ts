import * as stylex from '@stylexjs/stylex'
import { blur } from '../tokens/blur.stylex'
import type { BlurTheme } from './types'

/** The faintest hint of blur, just short of fully crisp. */
export const gauzeTheme: BlurTheme = stylex.createTheme(blur, {
  md: '1px',
})
