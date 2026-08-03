import { crispTheme as blurTheme } from '../blur-themes/crisp'
import { neutralTheme as colorBaseTheme } from '../color-themes/neutral'
import { zincTheme as colorTheme } from '../color-themes/zinc'
import { flatTheme as elevationTheme } from '../elevation-themes/flat'
import { briskTheme as motionTheme } from '../motion-themes/brisk'
import { snugTheme as radiusTheme } from '../radius-themes/snug'
import { denseTheme as spacingTheme } from '../spacing-themes/dense'
import { wireframeTheme as strokeTheme } from '../stroke-themes/wireframe'
import { compactTheme as typographyTheme } from '../typography-themes/compact'
import type { StylePreset, StylePresetThemes } from './types'

export const focusPreset = {
  description: 'A dense, quiet utility look for data-heavy dashboards.',
  color: 'zinc',
  spacing: 'dense',
  radius: 'snug',
  typography: 'compact',
  elevation: 'flat',
  stroke: 'wireframe',
  blur: 'crisp',
  motion: 'brisk',
} as const satisfies StylePreset

export const focusPresetThemes = [
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
