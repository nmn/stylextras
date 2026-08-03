import * as stylex from '@stylexjs/stylex'
import { stroke } from '../tokens/stroke.stylex'
import type { StrokeTheme } from './types'

export const docsTheme: StrokeTheme = stylex.createTheme(stroke, {
  thin: '1px',
  hairline: '1px',
  thick: '2px',
  heavy: '3px',
  focusRing: '2px',
  focusRingOffset: '0px',
})
