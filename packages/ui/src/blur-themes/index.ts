import { baseTheme } from './base'
import { crispTheme } from './crisp'
import { docsTheme } from './docs'
import { frostedTheme } from './frosted'
import { gauzeTheme } from './gauze'
import { hazyTheme } from './hazy'
import { softTheme } from './soft'
import { subtleTheme } from './subtle'
import type { BlurTheme } from './types'

export type { BlurTheme } from './types'
export { baseTheme } from './base'
export { docsTheme } from './docs'
export { crispTheme } from './crisp'
export { subtleTheme } from './subtle'
export { softTheme } from './soft'
export { hazyTheme } from './hazy'
export { gauzeTheme } from './gauze'
export { frostedTheme } from './frosted'

export const blurThemes = {
  base: baseTheme,
  docs: docsTheme,
  crisp: crispTheme,
  gauze: gauzeTheme,
  subtle: subtleTheme,
  soft: softTheme,
  hazy: hazyTheme,
  frosted: frostedTheme,
} as const satisfies Readonly<Record<string, BlurTheme>>

export type BlurThemeName = keyof typeof blurThemes
