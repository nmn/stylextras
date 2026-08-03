import { briskTheme } from './brisk'
import { docsTheme } from './docs'
import { expressiveTheme } from './expressive'
import { fluidTheme } from './fluid'
import { gentleTheme } from './gentle'
import { instantTheme } from './instant'
import { snappyTheme } from './snappy'
import { standardTheme } from './standard'
import type { MotionTheme } from './types'

export type { MotionTheme } from './types'
export { standardTheme } from './standard'
export { docsTheme } from './docs'
export { snappyTheme } from './snappy'
export { gentleTheme } from './gentle'
export { expressiveTheme } from './expressive'
export { instantTheme } from './instant'
export { fluidTheme } from './fluid'
export { briskTheme } from './brisk'

export const motionThemes = {
  standard: standardTheme,
  docs: docsTheme,
  brisk: briskTheme,
  snappy: snappyTheme,
  gentle: gentleTheme,
  fluid: fluidTheme,
  expressive: expressiveTheme,
  instant: instantTheme,
} as const satisfies Readonly<Record<string, MotionTheme>>

export type MotionThemeName = keyof typeof motionThemes
