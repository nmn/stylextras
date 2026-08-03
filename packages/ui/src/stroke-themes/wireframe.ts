import * as stylex from '@stylexjs/stylex'
import { stroke } from '../tokens/stroke.stylex'
import type { StrokeTheme } from './types'

/** Barely visible lines for wireframe-precision, low-ink interfaces. */
export const wireframeTheme: StrokeTheme = stylex.createTheme(stroke, {
  thin: '0.5px',
})
