import { airyTheme } from './airy'
import { baseTheme } from './base'
import { compactTheme } from './compact'
import { cozyTheme } from './cozy'
import { denseTheme } from './dense'
import { docsTheme } from './docs'
import { posterTheme } from './poster'
import { roomyTheme } from './roomy'
import { tightTheme } from './tight'
import type { SpacingTheme } from './types'

export type { SpacingTheme } from './types'
export { baseTheme } from './base'
export { docsTheme } from './docs'
export { tightTheme } from './tight'
export { microTheme } from './micro'
export { compactTheme } from './compact'
export { cozyTheme } from './cozy'
export { roomyTheme } from './roomy'
export { posterTheme } from './poster'
export { airyTheme } from './airy'
export { denseTheme } from './dense'

export const spacingThemes = {
  base: baseTheme,
  docs: docsTheme,
  dense: denseTheme,
  tight: tightTheme,
  compact: compactTheme,
  cozy: cozyTheme,
  roomy: roomyTheme,
  poster: posterTheme,
  airy: airyTheme,
} as const satisfies Readonly<Record<string, SpacingTheme>>

export type SpacingThemeName = keyof typeof spacingThemes
