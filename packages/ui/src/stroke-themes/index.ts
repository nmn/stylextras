import * as stylex from '@stylexjs/stylex'
import { stroke } from '../tokens/stroke.stylex'

export type StrokeTheme = stylex.Theme<typeof stroke>

export const baseTheme: StrokeTheme = stylex.createTheme(stroke, {})

export const docsTheme: StrokeTheme = stylex.createTheme(stroke, {
  thin: '1px',
  hairline: '1px',
  thick: '2px',
  heavy: '3px',
  focusRing: '2px',
  focusRingOffset: '0px',
})

export const hairlineTheme: StrokeTheme = stylex.createTheme(stroke, {
  thin: '0.75px',
})

export const boldTheme: StrokeTheme = stylex.createTheme(stroke, {
  thin: '1.5px',
})

export const posterTheme: StrokeTheme = stylex.createTheme(stroke, {
  thin: '2px',
})

export const brutalTheme: StrokeTheme = stylex.createTheme(stroke, {
  thin: '3px',
})

/** Barely visible lines for wireframe-precision, low-ink interfaces. */
export const wireframeTheme: StrokeTheme = stylex.createTheme(stroke, {
  thin: '0.5px',
})

/** Extra-heavy strokes for blocky, high-contrast expressive UI. */
export const blockTheme: StrokeTheme = stylex.createTheme(stroke, {
  thin: '4px',
})

export const strokeThemes: Readonly<{
  base: StrokeTheme
  docs: StrokeTheme
  wireframe: StrokeTheme
  hairline: StrokeTheme
  bold: StrokeTheme
  poster: StrokeTheme
  brutal: StrokeTheme
  block: StrokeTheme
}> = {
  base: baseTheme,
  docs: docsTheme,
  wireframe: wireframeTheme,
  hairline: hairlineTheme,
  bold: boldTheme,
  poster: posterTheme,
  brutal: brutalTheme,
  block: blockTheme,
}

export type StrokeThemeName = keyof typeof strokeThemes
