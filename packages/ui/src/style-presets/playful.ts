import { softTheme as blurTheme } from '../blur-themes/soft'
import { neutralTheme as colorBaseTheme } from '../color-themes/neutral'
import { pinkTheme as colorTheme } from '../color-themes/pink'
import { floatTheme as elevationTheme } from '../elevation-themes/float'
import { expressiveTheme as motionTheme } from '../motion-themes/expressive'
import { pillTheme as radiusTheme } from '../radius-themes/pill'
import { roomyTheme as spacingTheme } from '../spacing-themes/roomy'
import { boldTheme as strokeTheme } from '../stroke-themes/bold'
import { humanistTheme as typographyTheme } from '../typography-themes/humanist'
import type { StylePreset, StylePresetThemes } from './types'

export const playfulPreset = {
  description: 'A bouncy, saturated look for consumer and marketing surfaces.',
  color: 'pink',
  spacing: 'roomy',
  radius: 'pill',
  typography: 'humanist',
  elevation: 'float',
  stroke: 'bold',
  blur: 'soft',
  motion: 'expressive',
} as const satisfies StylePreset

export const playfulPresetThemes = [
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
