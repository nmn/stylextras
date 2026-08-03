import * as stylex from '@stylexjs/stylex'
import { stroke } from '../tokens/stroke.stylex'
import type { StrokeTheme } from './types'

export const brutalTheme: StrokeTheme = stylex.createTheme(stroke, {
  thin: '3px',
})
