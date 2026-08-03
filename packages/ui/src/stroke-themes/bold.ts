import * as stylex from '@stylexjs/stylex'
import { stroke } from '../tokens/stroke.stylex'
import type { StrokeTheme } from './types'

export const boldTheme: StrokeTheme = stylex.createTheme(stroke, {
  thin: '1.5px',
})
