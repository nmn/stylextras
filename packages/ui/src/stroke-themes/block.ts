import * as stylex from '@stylexjs/stylex'
import { stroke } from '../tokens/stroke.stylex'
import type { StrokeTheme } from './types'

/** Extra-heavy strokes for blocky, high-contrast expressive UI. */
export const blockTheme: StrokeTheme = stylex.createTheme(stroke, {
  thin: '4px',
})
