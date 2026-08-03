import { subtleTheme as blurTheme } from '../blur-themes/subtle'
import { emberTheme as colorTheme } from '../color-themes/ember'
import { neutralTheme as colorBaseTheme } from '../color-themes/neutral'
import { softTheme as elevationTheme } from '../elevation-themes/soft'
import { gentleTheme as motionTheme } from '../motion-themes/gentle'
import { roundedTheme as radiusTheme } from '../radius-themes/rounded'
import { cozyTheme as spacingTheme } from '../spacing-themes/cozy'
import { baseTheme as strokeTheme } from '../stroke-themes/base'
import { editorialTheme as typographyTheme } from '../typography-themes/editorial'
import type { StylePreset, StylePresetThemes } from './types'

export const emberPreset = {
  description: 'A warm, parchment-toned editorial layout with gentle motion.',
  color: 'ember',
  spacing: 'cozy',
  radius: 'rounded',
  typography: 'editorial',
  elevation: 'soft',
  stroke: 'base',
  blur: 'subtle',
  motion: 'gentle',
} as const satisfies StylePreset

export const emberPresetThemes = [
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
