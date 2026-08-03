import * as stylex from '@stylexjs/stylex'
import { blur } from '../tokens/blur.stylex'
import type { BlurTheme } from './types'

export const baseTheme: BlurTheme = stylex.createTheme(blur, {})
