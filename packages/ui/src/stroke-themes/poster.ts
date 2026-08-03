import * as stylex from '@stylexjs/stylex'
import { stroke } from '../tokens/stroke.stylex'
import type { StrokeTheme } from './types'

export const posterTheme: StrokeTheme = stylex.createTheme(stroke, {
  thin: '2px',
})
