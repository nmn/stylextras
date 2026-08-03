import * as stylex from '@stylexjs/stylex'
import { typography } from '../tokens/typography.stylex'
import type { TypographyTheme } from './types'

export const uiTheme: TypographyTheme = stylex.createTheme(typography, {})
