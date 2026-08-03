import { baseTheme } from './base'
import { docsTheme } from './docs'
import { flatTheme } from './flat'
import { floatTheme } from './float'
import { glassTheme } from './glass'
import { hardTheme } from './hard'
import { posterTheme } from './poster'
import { softTheme } from './soft'
import type { ElevationTheme } from './types'
import { whisperTheme } from './whisper'

export type { ElevationTheme } from './types'
export { baseTheme } from './base'
export { docsTheme } from './docs'
export { flatTheme } from './flat'
export { softTheme } from './soft'
export { floatTheme } from './float'
export { hardTheme } from './hard'
export { posterTheme } from './poster'
export { whisperTheme } from './whisper'
export { glassTheme } from './glass'

export const elevationThemes = {
  base: baseTheme,
  docs: docsTheme,
  flat: flatTheme,
  whisper: whisperTheme,
  soft: softTheme,
  float: floatTheme,
  glass: glassTheme,
  hard: hardTheme,
  poster: posterTheme,
} as const satisfies Readonly<Record<string, ElevationTheme>>

export type ElevationThemeName = keyof typeof elevationThemes
