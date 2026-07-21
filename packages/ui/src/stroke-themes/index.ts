import * as stylex from '@stylexjs/stylex'
import { stroke } from '../tokens/stroke.stylex'

export const baseTheme = stylex.createTheme(stroke, {})

export const docsTheme = stylex.createTheme(stroke, {
  thin: '1px',
  hairline: '1px',
  thick: '2px',
  heavy: '3px',
  focusRing: '2px',
  focusRingOffset: '0px',
})

export const hairlineTheme = stylex.createTheme(stroke, {
  thin: '0.75px',
})

export const boldTheme = stylex.createTheme(stroke, {
  thin: '1.5px',
})

export const posterTheme = stylex.createTheme(stroke, {
  thin: '2px',
})

export const brutalTheme = stylex.createTheme(stroke, {
  thin: '3px',
})

/** Barely visible lines for wireframe-precision, low-ink interfaces. */
export const wireframeTheme = stylex.createTheme(stroke, {
  thin: '0.5px',
})

/** Extra-heavy strokes for blocky, high-contrast expressive UI. */
export const blockTheme = stylex.createTheme(stroke, {
  thin: '4px',
})

export const strokeThemes = {
  base: baseTheme,
  docs: docsTheme,
  wireframe: wireframeTheme,
  hairline: hairlineTheme,
  bold: boldTheme,
  poster: posterTheme,
  brutal: brutalTheme,
  block: blockTheme,
} as const

export type StrokeThemeName = keyof typeof strokeThemes
