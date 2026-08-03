import { baseTheme } from './base'
import { docsTheme } from './docs'
import { pillTheme } from './pill'
import { plushTheme } from './plush'
import { roundedTheme } from './rounded'
import { sharpTheme } from './sharp'
import { snugTheme } from './snug'
import { softTheme } from './soft'
import { subtleTheme } from './subtle'
import type { RadiusTheme } from './types'

export type { RadiusTheme } from './types'
export { baseTheme } from './base'
export { docsTheme } from './docs'
export { sharpTheme } from './sharp'
export { roundedTheme } from './rounded'
export { subtleTheme } from './subtle'
export { softTheme } from './soft'
export { pillTheme } from './pill'
export { snugTheme } from './snug'
export { plushTheme } from './plush'

export const radiusThemes = {
  base: baseTheme,
  docs: docsTheme,
  sharp: sharpTheme,
  snug: snugTheme,
  subtle: subtleTheme,
  rounded: roundedTheme,
  soft: softTheme,
  pill: pillTheme,
  plush: plushTheme,
} as const satisfies Readonly<Record<string, RadiusTheme>>

export type RadiusThemeName = keyof typeof radiusThemes
