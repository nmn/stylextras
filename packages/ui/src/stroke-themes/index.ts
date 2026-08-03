import { baseTheme } from './base'
import { blockTheme } from './block'
import { boldTheme } from './bold'
import { brutalTheme } from './brutal'
import { docsTheme } from './docs'
import { hairlineTheme } from './hairline'
import { posterTheme } from './poster'
import type { StrokeTheme } from './types'
import { wireframeTheme } from './wireframe'

export type { StrokeTheme } from './types'
export { baseTheme } from './base'
export { docsTheme } from './docs'
export { hairlineTheme } from './hairline'
export { boldTheme } from './bold'
export { posterTheme } from './poster'
export { brutalTheme } from './brutal'
export { wireframeTheme } from './wireframe'
export { blockTheme } from './block'

export const strokeThemes = {
  base: baseTheme,
  docs: docsTheme,
  wireframe: wireframeTheme,
  hairline: hairlineTheme,
  bold: boldTheme,
  poster: posterTheme,
  brutal: brutalTheme,
  block: blockTheme,
} as const satisfies Readonly<Record<string, StrokeTheme>>

export type StrokeThemeName = keyof typeof strokeThemes
