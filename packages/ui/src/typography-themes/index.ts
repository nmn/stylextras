import { compactTheme } from './compact'
import { docsTheme } from './docs'
import { editorialTheme } from './editorial'
import { humanistTheme } from './humanist'
import { industrialTheme } from './industrial'
import { monoTheme } from './mono'
import type { TypographyTheme } from './types'
import { uiTheme } from './ui'

export type { TypographyTheme } from './types'
export { uiTheme } from './ui'
export { docsTheme } from './docs'
export { editorialTheme } from './editorial'
export { monoTheme } from './mono'
export { industrialTheme } from './industrial'
export { humanistTheme } from './humanist'
export { compactTheme } from './compact'

export const typographyThemes = {
  ui: uiTheme,
  docs: docsTheme,
  editorial: editorialTheme,
  mono: monoTheme,
  industrial: industrialTheme,
  humanist: humanistTheme,
  compact: compactTheme,
} as const satisfies Readonly<Record<string, TypographyTheme>>

export type TypographyThemeName = keyof typeof typographyThemes
