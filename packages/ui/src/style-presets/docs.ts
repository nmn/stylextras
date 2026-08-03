import { docsTheme as blurTheme } from '../blur-themes/docs'
import { docsTheme as colorTheme } from '../color-themes/docs'
import { neutralTheme as colorBaseTheme } from '../color-themes/neutral'
import { docsTheme as elevationTheme } from '../elevation-themes/docs'
import { docsTheme as motionTheme } from '../motion-themes/docs'
import { docsTheme as radiusTheme } from '../radius-themes/docs'
import { docsTheme as spacingTheme } from '../spacing-themes/docs'
import { docsTheme as strokeTheme } from '../stroke-themes/docs'
import { docsTheme as typographyTheme } from '../typography-themes/docs'
import type { StylePreset, StylePresetThemes } from './types'

export const docsPreset = {
  description: 'The Stylextras documentation site: calm, precise, and legible.',
  color: 'docs',
  spacing: 'docs',
  radius: 'docs',
  typography: 'docs',
  elevation: 'docs',
  stroke: 'docs',
  blur: 'docs',
  motion: 'docs',
} as const satisfies StylePreset

export const docsPresetThemes = [
  colorBaseTheme,
  colorTheme,
  spacingTheme,
  radiusTheme,
  typographyTheme,
  elevationTheme,
  strokeTheme,
  blurTheme,
  motionTheme,
] as const satisfies StylePresetThemes
