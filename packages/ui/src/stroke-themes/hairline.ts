import * as stylex from '@stylexjs/stylex'
import { stroke } from '../tokens/stroke.stylex'
import type { StrokeTheme } from './types'

export const hairlineTheme: StrokeTheme = stylex.createTheme(stroke, {
  thin: '0.75px',
})
